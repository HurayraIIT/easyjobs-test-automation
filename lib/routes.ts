export const routes = [
    {
        "method": "GET", 
        "path": "/api/v2/calendly/event-type-list",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/calendly/info",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/calendly/invite-candidate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/calendly/invitee-verify",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/calendly/oauth",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/calendly/remove",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/applied-job",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/assessment/{assessment}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/assessments",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/conversation",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/conversation/notifications",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/conversation/{id}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/conversation/{id}/message",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/education",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/education",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/education/re-order",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/education/{education}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/employment",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/employment",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/employment/re-order",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/employment/{education}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/job/{job}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/notification",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/notification/clear-all",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/notification/delete-all",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/notification/{notification}/clear",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/notification/{notification}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/photo",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/photo",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/resume",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/resume",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/resume",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/selected-job",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/candidate/selected-job",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/stats",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/candidate/unfinished-job",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/candidate/{applicant}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/checkout",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/checkout/cancel/{slug}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/checkout/success/{slug}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/city/{country?}/{state?}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/city/{country?}/{state?}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company-config",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/analytics",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/assessments",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/assessments/create",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/assessments/{assessment}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/assessments/{assessment}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/assessments/{assessment}/update",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/candidates",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/collaborator/stats",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/company-types",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/conversation-template",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/conversation-template-message",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/country-phonecode",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/jobs",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/managers",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/question/group/create",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/question/group/{group}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/question/group/{group}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/question/group/{group}/duplicate",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/question/group/{group}/update",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/question/groups",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/recent-applicants",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/recent-jobs",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/recent-jobs/analytics",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/remote-interview/client-token/save",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/activity-log",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/admin",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/admin",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/ai-setup",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/company/setting/ai-setup",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/application-setting",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/application-setting/update",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/apply-setting",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/apply-setting",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/apply-setting/update",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/basic-description",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/basic-description",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/basic-info",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/basic-info",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/basic-information",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/basic-information",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/beta-feature",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/company/setting/beta-feature",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/brand-color",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/brand-info",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/category",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/category/save",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/category/{category}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/change-onboard-template",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/collaborator",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/collaborator/{userId}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/company-config/google",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/company-config/google",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/company-config/linkedin",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/company-config/linkedin",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/company-image",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/company-photo",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/company-photo",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/company-photo",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/custom-apply-field",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/custom-apply-field",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/custom-apply-field/jobs/{field}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/custom-domain",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/custom-domain",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/custom-domain/admin",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/custom-domain/admin",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/email",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/email/reset-smtp-settings",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/email/sender-email",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/email/sender-email",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/email/smtp-settings",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/email/type/{type}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/company/setting/email/{type}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/company/setting/email/{type}/notify",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/hackerrank/key/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/integrations",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/integrations",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/key",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/key/create",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/key/{key}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/meta-info",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/meta-info",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/pipeline",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/pipeline",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/pipeline/{pipeline}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/pipeline/{pipeline}/update",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/company/setting/remove-cover-photo",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/company/setting/remove-powered-by",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/show-life",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/skill",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/skill/save",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/skill/{skill}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/slack/integration/disconnect",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/slack/notifications",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/slack/notifications",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/slack/redirect",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/template-menus",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/template-menus",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/templates",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/templates",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/user",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/user-app",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/user-app/update",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/user/add",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/user/{user}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/user/{user}/update",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/user/{user}/send-invitation/{jobPostId?}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/setting/user/notifications",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/setting/user/notifications",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/{fieldId}/apply-setting",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/company/setting/{fieldId}/custom-apply-field",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/company/stats",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/company/verify",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/continue/candidate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/conversation/applicants",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/conversation/applicants/{id}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/conversation/applicants/{id}/message",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/conversation/applicants/{id}/message/status",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/conversation/notifications",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/country",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/coupon",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/coupon/{plan}/{code}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/degree/{level?}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/department",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/designation",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/docusign/authorization",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/docusign/check-authentication",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/docusign/credentials",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/docusign/disconnect",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/docusign/oauth/initiate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/docusign/templates",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/education-level",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/forgot-password",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/google-sign-in",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/hackerrank/assign-assessment",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/hackerrank/candidate-cancel-invite",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/hackerrank/candidate-details",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/hackerrank/candidate-test",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/hackerrank/candidate-test/update",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/hackerrank/tests/{applicantId?}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/active",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/ai-generate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/all",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/navigation/{jobId}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/{applicant}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/applicant/{applicant}/attachment",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/applicant/{applicant}/attachment/{attachment}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/applicant/{applicant}/attachment/{attachment}/update",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/{applicant}/attachments",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/applicant/{applicant}/draft-message",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/applicant/{applicant}/draft-note",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/{applicant}/evaluation/ai-score",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/{applicant}/evaluation/questions",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/{applicant}/exists",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/applicant/{applicant}/note",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/applicant/{applicant}/note",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/applicant/{applicant}/note/{note}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/job/applicant/{applicant}/rating",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/archived",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/category/{subcategory?}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/create",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/draft",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/information-meta-data",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/permissions",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/published",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/quiz-meta-data",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/screening-meta-data",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/set-preview",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/skill",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/templates",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{applicant}/exists-test",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/{job}/assessment/{assessment}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/assessment/{assessment}/update",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/assign-assessment",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/basic",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/candidate/add",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/candidate/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/candidate/onboard",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/candidate/pending",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/candidate/pending/invite",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/candidate/reject",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/candidates",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/change-status",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/collaborators",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/collaborators",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/{job}/collaborators/{collaborator}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/collaborators/{collaborator}/update",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/{job}/delete",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/duplicate",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/image",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/invitation/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/invitations",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/notification",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/job/{job}/pinned",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/pipeline",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/pipeline/candidate",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/pipeline/candidate/re-order",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/pipeline/remote-interview",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/pipeline/remote-interview-client",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/pipeline/select",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/pipeline/update",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/pipeline/update-view-mode",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/quiz",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/quiz",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/{job}/quiz",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/required-fields",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/required-fields",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/job/{job}/screening",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/job/{job}/screening",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/job/{job}/screening",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/job/{job}/update",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/logout",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/manager/notification",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/manager/notification/clear-all",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/manager/notification/delete-all",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/manager/notification/{notification}/clear",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/manager/notification/{notification}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/my-account",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/my-account/billing",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/my-account/billing",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/my-account/change-password",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/my-account/information",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/my-account/last-seen-version",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/my-account/new-password-verification",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/my-account/password-changed-verification",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/my-account/payment",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/my-account/payment-action/{transaction}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/my-account/payment-history",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/my-account/paypal/payment-action/{transaction}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/nationality",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/onboard",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/onboard/email",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/onboard/status",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/password/reset",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/password/set",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/paypal/subscription",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/paypal/subscription/update",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/question-set/{id}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/quiz-question-set/{id}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/redirect-to-dashboard",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/release-notification/notify/{version}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/remote-interview-pipeline",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/screening-question-set/{id}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/setting/role-permissions",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/sign-in",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/sign-in-oauth/{provider}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/sign-in-oauth/{provider}/callback",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/sign-up",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/state/{country}",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/state/{country}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/subscribe",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/subscribe/session-create",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/subscription/cancel",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/subscription/move-to-free",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/subscription/packages",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/subscription/packages/{slug}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/subscription/pause",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/subscription/public-packages",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "PUT", 
        "path": "/api/v2/subscription/resume",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/subscription/verify",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "DELETE", 
        "path": "/api/v2/testlify/assessment/{assessment}/delete",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/testlify/assessments/{applicantId?}",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/testlify/disconnect",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/testlify/send-assessment-invite",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/testlify/send/otp",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/testlify/verify/otp",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/testlify/webhook",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/timezones",
        "automated": true,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/user",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "PATCH", 
        "path": "/api/v2/user/change-company",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/user/id",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "GET", 
        "path": "/api/v2/user/package",
        "automated": true,
        "flaky": true,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/verification/email/resend",
        "automated": false,
        "flaky": false,
        "description": ""
    },
    {
        "method": "POST", 
        "path": "/api/v2/verify/email",
        "automated": false,
        "flaky": false,
        "description": ""
    },
];