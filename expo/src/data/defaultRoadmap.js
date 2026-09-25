export const defaultProfile = {
  name: "Career Builder",
  targetRole: "IAM / Identity Engineer",
  experience: "Fresher / 0–1 year",
  locations: ["Lucknow", "Noida", "Delhi NCR", "Remote India"],
  currentSalary: "₹25,000/month",
  targetSalary: "₹8–10 LPA",
  timeline: "12 months",
  skills: [
    "Active Directory / AD DS",
    "Windows Server 2022",
    "Microsoft Entra ID",
    "MFA / Conditional Access",
    "RBAC",
    "Provisioning / Deprovisioning",
    "Group Policy",
    "PowerShell",
    "Identity Lifecycle Management",
    "SAML / OAuth / Federation / SSO"
  ]
};

export const defaultRoadmap = [
  {
    id: "p1", title: "Foundation: AD DS & Windows", weeks: "Weeks 1–6",
    goal: "Build strong enterprise identity and Windows administration fundamentals.",
    tasks: [
      ["AD DS architecture, domains, forests and DCs", true],
      ["DNS, DHCP, domain join and troubleshooting", true],
      ["OUs, users, groups and delegation", true],
      ["GPO design, password and lockout policies", true],
      ["Kerberos, NTLM and replication fundamentals", false],
      ["FSMO, AD backup/restore and health checks", true]
    ],
    project: "Build a Windows Server 2022 domain controller + Windows 11 client lab and document the design."
  },
  {
    id: "p2", title: "PowerShell & Automation", weeks: "Weeks 7–10",
    goal: "Automate repeatable identity administration tasks.",
    tasks: [
      ["PowerShell fundamentals and objects", false],
      ["Get/New/Set/Remove-ADUser and ADGroup", false],
      ["Bulk user provisioning from CSV", false],
      ["Password reset and account unlock automation", false],
      ["Reporting: inactive users and group membership", false]
    ],
    project: "Create a PowerShell IAM toolkit for onboarding, offboarding and access reports."
  },
  {
    id: "p3", title: "Microsoft Entra ID", weeks: "Weeks 11–16",
    goal: "Move from on-prem AD administration into cloud identity.",
    tasks: [
      ["Tenant, users, groups and administrative roles", false],
      ["Hybrid identity: PHS and Cloud Sync concepts", false],
      ["Conditional Access policies", false],
      ["MFA and authentication methods", false],
      ["PIM and least privilege", false],
      ["Microsoft Graph / Graph PowerShell basics", false]
    ],
    project: "Create an Entra tenant lab with role separation, MFA and Conditional Access scenarios."
  },
  {
    id: "p4", title: "SSO, Federation & Lifecycle", weeks: "Weeks 17–22",
    goal: "Understand how applications consume identity.",
    tasks: [
      ["SAML assertions and SSO flow", false],
      ["OAuth 2.0 and OIDC concepts", false],
      ["Federation and troubleshooting", false],
      ["JML: Joiner, Mover, Leaver lifecycle", false],
      ["SCIM provisioning concepts", false],
      ["RBAC and access request design", false]
    ],
    project: "Document an end-to-end SSO + lifecycle flow including provisioning and deprovisioning."
  },
  {
    id: "p5", title: "IAM Platform & Governance", weeks: "Weeks 23–32",
    goal: "Develop enterprise IAM operations and governance knowledge.",
    tasks: [
      ["Access certification campaigns", false],
      ["SoD and least-privilege concepts", false],
      ["Privileged access / PAM fundamentals", false],
      ["SailPoint IdentityIQ architecture", false],
      ["Identity governance workflows", false],
      ["Audit evidence and access reviews", false]
    ],
    project: "Design a small IGA solution: identities, roles, request workflow, approval and certification."
  },
  {
    id: "p6", title: "Job Readiness & Interviews", weeks: "Weeks 33–52",
    goal: "Turn the technical roadmap into a job-ready portfolio.",
    tasks: [
      ["Build IAM-focused resume", false],
      ["Create GitHub/project documentation", false],
      ["Practice AD troubleshooting scenarios", false],
      ["Practice Entra / SSO / MFA interview questions", false],
      ["Practice IAM case studies and STAR answers", false],
      ["Track applications and follow-ups", false]
    ],
    project: "Publish 3 documented IAM projects and run a weekly interview/application cycle."
  }
];

export const interviewSets = [
  {id:"i1", category:"AD / Windows", q:"A user cannot log in to the domain. What would you troubleshoot first?", a:"Check account status, password/lockout, network/DNS, domain reachability, time synchronization, DC health and relevant logs."},
  {id:"i2", category:"Entra ID", q:"What is the purpose of Conditional Access?", a:"It applies access controls based on signals such as user, device, location, application and risk, then requires controls such as MFA or blocks access."},
  {id:"i3", category:"IAM", q:"Explain Joiner-Mover-Leaver.", a:"Joiner creates appropriate access, Mover changes access when a person changes role, and Leaver removes or disables access when employment ends."},
  {id:"i4", category:"SSO", q:"What problem does SAML solve?", a:"It enables federated authentication so an identity provider can authenticate a user and provide assertions to a service provider."},
  {id:"i5", category:"RBAC", q:"What is RBAC?", a:"Role-Based Access Control assigns permissions through roles rather than granting individual permissions directly, supporting consistent least-privilege access."}
];

export const jobs = [
  {id:"j1", company:"Deloitte", role:"IAM / Cyber Risk – Analyst", location:"Lucknow / India", exp:"Fresher–1 year", salary:"Verify current posting", status:"Track"},
  {id:"j2", company:"HCLTech", role:"Identity / Azure AD Support", location:"Lucknow / India", exp:"Fresher–1 year", salary:"Verify current posting", status:"Track"},
  {id:"j3", company:"Kyndryl", role:"IAM / Cloud Security Associate", location:"India / Hybrid", exp:"Junior", salary:"Verify current posting", status:"Track"},
  {id:"j4", company:"Accenture", role:"Associate Security Engineer – IAM", location:"India", exp:"Junior", salary:"Verify current posting", status:"Track"},
  {id:"j5", company:"Cognizant", role:"IAM / Identity Operations", location:"India", exp:"Junior", salary:"Verify current posting", status:"Track"}
];