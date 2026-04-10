#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const seedPath = path.join(repoRoot, "data", "brooklyn_startup_jobs_seed.json");
const reportPath = path.join(repoRoot, "data", "weekly_job_report.json");

async function checkUrl(url) {
  try {
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (response.ok || response.status === 405 || response.status === 403) {
      return { ok: true, status: response.status, finalUrl: response.url };
    }

    const fallback = await fetch(url, { method: "GET", redirect: "follow" });
    return { ok: fallback.ok, status: fallback.status, finalUrl: fallback.url };
  } catch {
    return { ok: false, status: 0, finalUrl: url };
  }
}

async function main() {
  const raw = await fs.readFile(seedPath, "utf8");
  const jobs = JSON.parse(raw);

  const checkedAt = new Date().toISOString();
  const checks = [];

  for (const job of jobs) {
    const result = await checkUrl(job.sourceUrl);
    checks.push({
      ...job,
      checkedAt,
      reachable: result.ok,
      httpStatus: result.status,
      checkedUrl: result.finalUrl,
    });
  }

  const report = {
    generatedAt: checkedAt,
    totalJobs: checks.length,
    reachableCount: checks.filter((c) => c.reachable).length,
    checks,
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(`Weekly job check complete: ${report.reachableCount}/${report.totalJobs} URLs reachable.`);
  console.log(`Report written: ${path.relative(repoRoot, reportPath)}`);
}

main().catch((error) => {
  console.error("Weekly job check failed.");
  console.error(error);
  process.exit(1);
});
