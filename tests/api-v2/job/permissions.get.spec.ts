// GET: /api/v2/job/permissions

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { deleteAllDraftJobs, createDraftJob } from '@datafactory/job';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/permissions GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/permissions`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);

        let job_permissions = body.data.permissions[0];
        let candidate_permissions = body.data.permissions[1];

        // console.log(body.data.permissions[1]);
        expect(job_permissions.name).toBe("Jobs");
        expect(job_permissions.permissions[0].key).toBe("job.view");
        expect(job_permissions.permissions[0].name).toBe("View Job");
        expect(job_permissions.permissions[0].hint).toBe("The collaborator can view the job. (Collaborator must have this permission.)");
        expect(job_permissions.permissions[0].icon).toBe("e-eye-1");
        expect(job_permissions.permissions[0].dependencies).toEqual(["job.view"]);
        expect(job_permissions.permissions[1].key).toBe("job.management");
        expect(job_permissions.permissions[1].name).toBe("Manage Job");
        expect(job_permissions.permissions[1].hint).toBe("The collaborator can edit job, edit pipeline of the assigned job and archive the job.");
        expect(job_permissions.permissions[1].icon).toBe("e-management");
        expect(job_permissions.permissions[1].dependencies).toEqual(["job.view"]);
        expect(job_permissions.permissions[2].key).toBe("job.publish");
        expect(job_permissions.permissions[2].name).toBe("Publish Job");
        expect(job_permissions.permissions[2].hint).toBe("The collaborator can publish, re-publish the assigned job.");
        expect(job_permissions.permissions[2].icon).toBe("e-tick-alt");
        expect(job_permissions.permissions[2].dependencies).toEqual(["job.view", "job.management"]);

        // await createAssertions(candidate_permissions);
        expect(candidate_permissions.name).toBe("Candidates");
        expect(candidate_permissions.permissions[0].key).toBe("candidate.view");
        expect(candidate_permissions.permissions[0].name).toBe("View Candidates");
        expect(candidate_permissions.permissions[0].hint).toBe("The collaborator can search, view & export details of candidates. Also can view/download attachments of candidates and write notes. (Collaborator must have this permission.)");
        expect(candidate_permissions.permissions[0].icon).toBe("e-candidates");
        expect(candidate_permissions.permissions[0].dependencies).toEqual(["candidate.view"]);
        expect(candidate_permissions.permissions[1].key).toBe("candidate.delete");
        expect(candidate_permissions.permissions[1].name).toBe("Delete/Remove Candidates");
        expect(candidate_permissions.permissions[1].hint).toBe("The collaborator can remove any applied & pending candidates from the assigned job.");
        expect(candidate_permissions.permissions[1].icon).toBe("e-delete");
        expect(candidate_permissions.permissions[1].dependencies).toEqual(["candidate.view"]);
        expect(candidate_permissions.permissions[2].key).toBe("candidate.organize");
        expect(candidate_permissions.permissions[2].name).toBe("Organize Candidates");
        expect(candidate_permissions.permissions[2].hint).toBe("The collaborator can update pipeline/stage of candidates, invite candidate, manage candidates attachments, rate candidates & can do conversation with candidates.");
        expect(candidate_permissions.permissions[2].icon).toBe("e-management");
        expect(candidate_permissions.permissions[2].dependencies).toEqual(["candidate.view"]);
    });

    test("GET with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/permissions`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.permissions[0].name).toBe("Jobs");
        expect(body.data.permissions[0].permissions[0].key).toBe("job.view");
        expect(body.data.permissions[0].permissions[0].name).toBe("View Job");
        expect(body.data.permissions[0].permissions[0].hint).toBe("The collaborator can view the job. (Collaborator must have this permission.)");
        expect(body.data.permissions[0].permissions[0].icon).toBe("e-eye-1");
        expect(body.data.permissions[0].permissions[0].dependencies).toEqual(["job.view"]);
        expect(body.data.permissions[0].permissions[1].key).toBe("job.management");
        expect(body.data.permissions[0].permissions[1].name).toBe("Manage Job");
        expect(body.data.permissions[0].permissions[1].hint).toBe("The collaborator can edit job, edit pipeline of the assigned job and archive the job.");
        expect(body.data.permissions[0].permissions[1].icon).toBe("e-management");
        expect(body.data.permissions[0].permissions[1].dependencies).toEqual(["job.view"]);
        expect(body.data.permissions[0].permissions[2].key).toBe("job.publish");
        expect(body.data.permissions[0].permissions[2].name).toBe("Publish Job");
        expect(body.data.permissions[0].permissions[2].hint).toBe("The collaborator can publish, re-publish the assigned job.");
        expect(body.data.permissions[0].permissions[2].icon).toBe("e-tick-alt");
        expect(body.data.permissions[0].permissions[2].dependencies).toEqual(["job.view", "job.management"]);
        expect(body.data.permissions[1].name).toBe("Candidates");
        expect(body.data.permissions[1].permissions[0].key).toBe("candidate.view");
        expect(body.data.permissions[1].permissions[0].name).toBe("View Candidates");
        expect(body.data.permissions[1].permissions[0].hint).toBe("The collaborator can search, view & export details of candidates. Also can view/download attachments of candidates and write notes. (Collaborator must have this permission.)");
        expect(body.data.permissions[1].permissions[0].icon).toBe("e-candidates");
        expect(body.data.permissions[1].permissions[0].dependencies).toEqual(["candidate.view"]);
        expect(body.data.permissions[1].permissions[1].key).toBe("candidate.delete");
        expect(body.data.permissions[1].permissions[1].name).toBe("Delete/Remove Candidates");
        expect(body.data.permissions[1].permissions[1].hint).toBe("The collaborator can remove any applied & pending candidates from the assigned job.");
        expect(body.data.permissions[1].permissions[1].icon).toBe("e-delete");
        expect(body.data.permissions[1].permissions[1].dependencies).toEqual(["candidate.view"]);
        expect(body.data.permissions[1].permissions[2].key).toBe("candidate.organize");
        expect(body.data.permissions[1].permissions[2].name).toBe("Organize Candidates");
        expect(body.data.permissions[1].permissions[2].hint).toBe("The collaborator can update pipeline/stage of candidates, invite candidate, manage candidates attachments, rate candidates & can do conversation with candidates.");
        expect(body.data.permissions[1].permissions[2].icon).toBe("e-management");
        expect(body.data.permissions[1].permissions[2].dependencies).toEqual(["candidate.view"]);
        expect(body.message).toBeNull();
    });

    test("GET without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/job/permissions`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.permissions[0].name).toBe("Jobs");
        expect(body.data.permissions[0].permissions[0].key).toBe("job.view");
        expect(body.data.permissions[0].permissions[0].name).toBe("View Job");
        expect(body.data.permissions[0].permissions[0].hint).toBe("The collaborator can view the job. (Collaborator must have this permission.)");
        expect(body.data.permissions[0].permissions[0].icon).toBe("e-eye-1");
        expect(body.data.permissions[0].permissions[0].dependencies).toEqual(["job.view"]);
        expect(body.data.permissions[0].permissions[1].key).toBe("job.management");
        expect(body.data.permissions[0].permissions[1].name).toBe("Manage Job");
        expect(body.data.permissions[0].permissions[1].hint).toBe("The collaborator can edit job, edit pipeline of the assigned job and archive the job.");
        expect(body.data.permissions[0].permissions[1].icon).toBe("e-management");
        expect(body.data.permissions[0].permissions[1].dependencies).toEqual(["job.view"]);
        expect(body.data.permissions[0].permissions[2].key).toBe("job.publish");
        expect(body.data.permissions[0].permissions[2].name).toBe("Publish Job");
        expect(body.data.permissions[0].permissions[2].hint).toBe("The collaborator can publish, re-publish the assigned job.");
        expect(body.data.permissions[0].permissions[2].icon).toBe("e-tick-alt");
        expect(body.data.permissions[0].permissions[2].dependencies).toEqual(["job.view", "job.management"]);
        expect(body.data.permissions[1].name).toBe("Candidates");
        expect(body.data.permissions[1].permissions[0].key).toBe("candidate.view");
        expect(body.data.permissions[1].permissions[0].name).toBe("View Candidates");
        expect(body.data.permissions[1].permissions[0].hint).toBe("The collaborator can search, view & export details of candidates. Also can view/download attachments of candidates and write notes. (Collaborator must have this permission.)");
        expect(body.data.permissions[1].permissions[0].icon).toBe("e-candidates");
        expect(body.data.permissions[1].permissions[0].dependencies).toEqual(["candidate.view"]);
        expect(body.data.permissions[1].permissions[1].key).toBe("candidate.delete");
        expect(body.data.permissions[1].permissions[1].name).toBe("Delete/Remove Candidates");
        expect(body.data.permissions[1].permissions[1].hint).toBe("The collaborator can remove any applied & pending candidates from the assigned job.");
        expect(body.data.permissions[1].permissions[1].icon).toBe("e-delete");
        expect(body.data.permissions[1].permissions[1].dependencies).toEqual(["candidate.view"]);
        expect(body.data.permissions[1].permissions[2].key).toBe("candidate.organize");
        expect(body.data.permissions[1].permissions[2].name).toBe("Organize Candidates");
        expect(body.data.permissions[1].permissions[2].hint).toBe("The collaborator can update pipeline/stage of candidates, invite candidate, manage candidates attachments, rate candidates & can do conversation with candidates.");
        expect(body.data.permissions[1].permissions[2].icon).toBe("e-management");
        expect(body.data.permissions[1].permissions[2].dependencies).toEqual(["candidate.view"]);
        expect(body.message).toBeNull();
    });
});
