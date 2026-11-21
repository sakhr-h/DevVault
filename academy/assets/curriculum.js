(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.AcademyCurriculum = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const courses = [
    ['01','bettercap','Bettercap Fundamentals & Passive Network Reconnaissance',1,'Network Security','45–60 min','Passive inventory, trust boundaries, monitoring and defensive validation.','network passive inventory monitoring'],
    ['02','osint','OSINT Fundamentals & Passive Information Gathering',1,'OSINT','35–45 min','Ethical passive research, source evaluation, privacy, and documentation.','osint passive privacy sources'],
    ['03','beef','BeEF Architecture & Browser Security Concepts',3,'Browser Security','35–45 min','Browser trust boundaries, architecture, detection, and defenses.','browser architecture session defense'],
    ['04','file-threats','File & Image-Based Threat Mechanics',3,'Threat Analysis','40–50 min','Risky file delivery, safe inspection, and containment.','file image metadata containment'],
    ['05','kali','Kali Linux Fundamentals',0,'Linux','35–45 min','Navigate Kali safely, manage packages, permissions, and lab hygiene.','kali linux permissions terminal'],
    ['06','network-defenses','DNS, MITM & Network Poisoning Defenses',2,'Network Defense','45–55 min','Recognize traffic-manipulation risks and strengthen layered defenses.','dns mitm arp dhcp poisoning'],
    ['07','scanning','Network Scanning, Zenmap & Metasploit',2,'Assessment','45–55 min','Interpret authorized inventory results and apply assessment governance.','inventory scanning zenmap governance'],
    ['08','wireless','Wireless Security',3,'Wireless','35–45 min','Wi-Fi security, configuration risks, monitoring, and response.','wireless wifi wpa monitoring'],
    ['09','wireshark','Wireshark & Traffic Analysis',1,'Traffic Analysis','40–50 min','Read packet captures, use display filters, and identify defensive signals.','wireshark pcap tcp dns'],
    ['10','web-scanning','Web Vulnerability Scanning & Remediation',2,'Web Security','40–55 min','Assess owned web apps, interpret findings, and remediate safely.','xss sql injection headers remediation'],
    ['11','http-web-security','Web Application Security & HTTP Fundamentals',0,'Web Security','40–55 min','Understand HTTP, browser trust boundaries, headers, and sessions.','http csp cors hsts cookies'],
    ['12','html-fundamentals','HTML5 Fundamentals & Semantic Structure',0,'Development','40–55 min','Build accessible semantic structures, forms, labels, and clean HTML.','html semantic forms accessibility'],
    ['13','javascript-fundamentals','JavaScript Fundamentals for Web & Security',0,'Development','40–55 min','Use variables, functions, events, and safe DOM handling.','javascript dom textcontent events'],
    ['14','python-fundamentals','Python Fundamentals & Automation',0,'Development','40–55 min','Write understandable programs for local files and structured data.','python automation pathlib json csv'],
    ['15','network-logs','Network Traffic & Log Analysis Basics',0,'Detection','40–55 min','Build baselines, read logs, and investigate unusual patterns.','logs baselines anomalies dns firewall'],
    ['16','endpoint-linux-hardening','Endpoint & Linux Hardening Fundamentals',4,'Hardening','40–55 min','Reduce attack surface with least privilege and secure defaults.','linux hardening services least privilege'],
    ['17','incident-response-hunting','Incident Response & Threat Hunting Basics',4,'Incident Response','40–55 min','Prepare, preserve evidence, investigate hypotheses, and recover.','incident response hunting evidence timeline'],
    ['18','pentest-methodology','Penetration Testing Methodology & Enumeration',5,'Authorized Assessment','55–70 min','Plan authorized assessments and turn observations into evidence-backed findings.','scope rules engagement enumeration evidence','A'],
    ['19','owasp-safe-labs','OWASP Top 10 & Safe Web Security Labs',5,'Web Security','60–75 min','Study common web risks through safe, local validation and remediation.','owasp top 10 safe labs remediation','A'],
    ['20','privilege-defenses','Linux & Windows Privilege Escalation Defenses',5,'Endpoint Defense','55–70 min','Recognize privilege pathways and remove unsafe permissions and configuration.','linux windows privilege escalation defense','A'],
    ['21','pentest-reporting','Penetration Test Reporting & Remediation',5,'Security Reporting','45–60 min','Write reproducible findings, prioritize risk, and verify remediation.','report finding risk remediation retest','A'],
    ['22','threat-modeling','Threat Modeling & Secure Design',5,'Secure Design','50–65 min','Map assets, trust boundaries, abuse cases, and design controls.','threat model stride trust boundaries','B'],
    ['23','identity-access','Identity, Authentication & Access Control',5,'Identity','55–70 min','Apply risk-based identity assurance, authentication, authorization, and federation.','nist 800-63-4 ial aal fal passkeys','B'],
    ['24','tls-pki','TLS, Certificates & PKI Operations',5,'Cryptography','55–70 min','Operate certificate lifecycles and diagnose trust without weakening validation.','tls certificates pki revocation trust','B'],
    ['25','secure-cicd','Secure CI/CD & Software Supply Chain',5,'Supply Chain','55–70 min','Protect source, builds, dependencies, provenance, and release verification.','slsa cicd provenance dependencies sbom','B'],
    ['26','detection-engineering','Detection Engineering & Alert Validation',5,'Detection','55–70 min','Design testable analytics, map behavior, tune noise, and validate coverage.','mitre attack analytics telemetry alert','B'],
    ['27','container-kubernetes','Container & Kubernetes Security',5,'Cloud Native','60–75 min','Harden images, workloads, identities, network policy, and cluster operations.','container kubernetes rbac network policy admission','B']
  ].map(row => ({
    num: row[0], id: row[1], title: row[2], stage: row[3], category: row[4], duration: row[5],
    description: row[6], keywords: row[7], track: row[8] || null,
    level: row[3] === 0 ? 'Foundation' : row[3] < 3 ? 'Beginner' : row[3] < 5 ? 'Intermediate' : 'Specialization',
    module: row[1] === 'bettercap' ? 'courses/bettercap.js' : Number(row[0]) <= 17 ? 'courses/catalog.js' : 'courses/expansion.js'
  }));

  const stages = [
    { id:'stage-0', number:0, title:'Foundations', ar:'الأساسيات', courses:['html-fundamentals','javascript-fundamentals','python-fundamentals','kali','http-web-security','network-logs'] },
    { id:'stage-1', number:1, title:'Observation & Analysis', ar:'الملاحظة والتحليل', courses:['osint','bettercap','wireshark'] },
    { id:'stage-2', number:2, title:'Authorized Assessment & Defense', ar:'التقييم المصرح والدفاع', courses:['network-defenses','scanning','web-scanning'] },
    { id:'stage-3', number:3, title:'Threat Mechanics', ar:'آليات التهديد', courses:['beef','file-threats','wireless'], retentionFrom:'stage-1' },
    { id:'stage-4', number:4, title:'Hardening & Response', ar:'التحصين والاستجابة', courses:['endpoint-linux-hardening','incident-response-hunting'], retentionFrom:'stage-2' },
    { id:'stage-5', number:5, title:'Specializations', ar:'المسارات التخصصية', courses:['pentest-methodology','owasp-safe-labs','privilege-defenses','pentest-reporting','threat-modeling','identity-access','tls-pki','secure-cicd','detection-engineering','container-kubernetes'], retentionFrom:'stage-3' }
  ];

  const tracks = [
    { id:'track-a', code:'A', title:'Authorized Penetration Testing', ar:'اختبار الاختراق المصرح', courses:courses.filter(c=>c.track==='A').map(c=>c.id) },
    { id:'track-b', code:'B', title:'Security Engineering & Detection', ar:'الهندسة الأمنية والكشف', courses:courses.filter(c=>c.track==='B').map(c=>c.id) }
  ];
  const byId = Object.fromEntries(courses.map(c => [c.id, c]));
  const stageById = Object.fromEntries(stages.map(s => [s.id, s]));
  const trackById = Object.fromEntries(tracks.map(t => [t.id, t]));
  const courseStage = id => stages.find(s => s.courses.includes(id));
  const courseTrack = id => tracks.find(t => t.courses.includes(id)) || null;

  return Object.freeze({ version:2, passMark:90, courses, stages, tracks, byId, stageById, trackById, courseStage, courseTrack });
});
