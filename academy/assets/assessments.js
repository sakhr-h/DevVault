(function (root, factory) {
  const api = factory(root.AcademyCurriculum || (typeof require === 'function' ? require('./curriculum.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.AcademyAssessments = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (C) {
  'use strict';
  const facts = {
    bettercap:['passive inventory','authorized network boundaries','baseline changes'], osint:['source corroboration','privacy minimization','research notes'],
    beef:['browser trust boundaries','session exposure','content security policy'], 'file-threats':['file-type verification','safe isolation','metadata inspection'],
    kali:['least privilege','package provenance','lab snapshots'], 'network-defenses':['authenticated protocols','DHCP and ARP monitoring','segmentation'],
    scanning:['written scope','asset inventory','finding validation'], wireless:['WPA3 where supported','strong enrollment','rogue access-point monitoring'],
    wireshark:['capture scope','display filters','protocol baselines'], 'web-scanning':['finding validation','context-aware output encoding','parameterized queries'],
    'http-web-security':['secure cookie attributes','CSP','origin-aware CORS'], 'html-fundamentals':['semantic elements','associated form labels','client validation is not authorization'],
    'javascript-fundamentals':['textContent for plain text','event boundaries','untrusted input handling'], 'python-fundamentals':['explicit paths','structured parsing','clear error handling'],
    'network-logs':['normalized timestamps','baseline comparison','correlated evidence'], 'endpoint-linux-hardening':['least privilege','minimal services','patch governance'],
    'incident-response-hunting':['evidence preservation','documented timeline','hypothesis testing'], 'pentest-methodology':['rules of engagement','coverage notes','reproducible evidence'],
    'owasp-safe-labs':['local training target','server-side validation','verified remediation'], 'privilege-defenses':['permission review','service account hygiene','configuration baselines'],
    'pentest-reporting':['business impact','reproduction evidence','remediation verification'], 'threat-modeling':['assets and actors','trust boundaries','abuse cases'],
    'identity-access':['IAL AAL and FAL','phishing-resistant authentication','least-privilege authorization'], 'tls-pki':['certificate chain','hostname validation','renewal and revocation'],
    'secure-cicd':['protected source','build provenance','artifact verification'], 'detection-engineering':['behavior hypothesis','required telemetry','false-positive tuning'],
    'container-kubernetes':['non-root workloads','least-privilege RBAC','default-deny network policy']
  };
  const title = id => C.byId[id].title;
  const distractors = id => C.courses.filter(c=>c.id!==id).slice(0,3).map(c=>c.description);
  function forCourse(id) {
    const m=C.byId[id], f=facts[id], d=distractors(id);
    return [
      { id:`${id}-objective`, type:'single', topic:m.category, q:`Which outcome best matches ${m.title}?`, options:[m.description,...d], correct:[0], explanation:`The course objective is to ${m.description.charAt(0).toLowerCase()+m.description.slice(1)}` },
      { id:`${id}-concept`, type:'single', topic:f[0], q:`Which concept belongs directly in a defensive review of ${m.title}?`, options:[f[0],'Disable audit trails','Trust every external input','Skip authorization records'], correct:[0], explanation:`${f[0]} is a core review concept; the other choices remove safeguards.` },
      { id:`${id}-select`, type:'multiple', topic:m.category, q:`Select the two sound practices for ${m.title}.`, options:[f[1],f[2],'Test third-party systems without permission','Remove logs before validation'], correct:[0,1], explanation:`${f[1]} and ${f[2]} preserve safety and evidence.` },
      { id:`${id}-scope`, type:'truefalse', topic:'Authorization', q:`True or false: ${m.title} activities may be run against any public target when the intent is educational.`, options:['True','False'], correct:[1], explanation:'Educational intent never replaces explicit authorization and an agreed scope.' },
      { id:`${id}-scenario`, type:'single', topic:f[1], q:`A lab observation related to ${m.title} is unclear. What is the best next step?`, options:['Preserve evidence, verify scope, and reproduce safely','Escalate impact on production','Collect real user secrets','Disable monitoring to avoid noise'], correct:[0], explanation:'Safe reproduction with preserved evidence supports a defensible conclusion.' },
      { id:`${id}-mitigation`, type:'single', topic:f[2], q:`Which action most improves resilience in the ${m.category} context?`, options:[`Apply and verify ${f[2]}`,'Rely on obscurity alone','Treat one clean result as permanent proof','Give every account administrative rights'], correct:[0], explanation:`Applying and verifying ${f[2]} creates an observable control rather than an assumption.` }
      ,{ id:`${id}-evidence`, type:'single', topic:'Evidence', q:`Which evidence practice best supports a ${m.title} conclusion?`, options:['Record source, time, scope, method, and limitations','Keep only an unsupported conclusion','Remove timestamps','Collect unrelated personal data'], correct:[0], explanation:'Reproducible evidence includes provenance, scope, method, and limitations while minimizing sensitive data.' }
      ,{ id:`${id}-boundary`, type:'single', topic:f[0], q:`What should a reviewer identify first when applying ${f[0]}?`, options:['Assets, owners, and trust boundaries','A way to bypass monitoring','Unapproved adjacent targets','Credentials from real users'], correct:[0], explanation:'Assets, owners, and boundaries make assumptions explicit and keep the review within scope.' }
      ,{ id:`${id}-verify`, type:'multiple', topic:f[2], q:`Select the two parts of a verifiable ${f[2]} improvement.`, options:['A measurable expected result','A retained test signal','No accountable owner','A hidden exception with no expiry'], correct:[0,1], explanation:'A measurable result and retained signal let another reviewer confirm the control.' }
      ,{ id:`${id}-priority`, type:'single', topic:'Risk', q:`How should a ${m.category} issue be prioritized?`, options:['Document likelihood, impact, exposure, and assumptions','Rank every issue critical','Use tool output without validation','Ignore business context'], correct:[0], explanation:'Risk priority requires validated context and explicit assumptions, not a tool label alone.' }
      ,{ id:`${id}-change`, type:'truefalse', topic:'Verification', q:`True or false: a control related to ${m.title} should be retested after a material architecture or telemetry change.`, options:['True','False'], correct:[0], explanation:'Material changes can invalidate earlier evidence, so affected controls need retesting.' }
      ,{ id:`${id}-handoff`, type:'single', topic:'Operations', q:`What makes a ${m.title} remediation ready for operational handoff?`, options:['Owner, rollout, rollback, monitoring, and retest criteria','A screenshot with no context','An undocumented emergency change','A promise to check later'], correct:[0], explanation:'Operational handoff needs ownership, controlled change, observability, and verification.' }
    ];
  }
  const courseBanks=Object.fromEntries(C.courses.map(c=>[c.id,forCourse(c.id)]));
  const shuffle = (array, rng=Math.random) => {
    const a=array.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a;
  };
  const targetCourseIds = targetId => C.stageById[targetId]?.courses || C.trackById[targetId]?.courses || [];
  const bank = targetId => targetCourseIds(targetId).flatMap(id=>courseBanks[id]);
  function randomized(question, rng=Math.random) {
    const pairs=question.options.map((text,index)=>({text,index}));
    const mixed=shuffle(pairs,rng);
    return {...question,options:mixed.map(p=>p.text),correct:mixed.map((p,i)=>question.correct.includes(p.index)?i:-1).filter(i=>i>=0)};
  }
  function createAttempt(targetId, rng=Math.random) {
    const targetStage=C.stageById[targetId] || C.stageById['stage-5'];
    const retentionId=targetStage.number>=3 ? targetStage.retentionFrom : null;
    const currentCount=retentionId ? 10 : 20;
    const current=shuffle(bank(targetId),rng).slice(0,currentCount).map(q=>({...randomized(q,rng),section:'current'}));
    const retention=retentionId ? shuffle(bank(retentionId),rng).slice(0,10).map(q=>({...randomized(q,rng),id:`ret-${targetId}-${q.id}`,sourceId:q.id,section:'retention'})) : [];
    return { id:`${targetId}-${Date.now()}`, targetId, retentionId, questions:shuffle([...current,...retention],rng) };
  }
  function grade(attempt, answers) {
    const rows=attempt.questions.map(q=>{
      const selected=(answers[q.id]||[]).map(Number).sort((a,b)=>a-b), expected=q.correct.slice().sort((a,b)=>a-b);
      const correct=selected.length===expected.length && selected.every((v,i)=>v===expected[i]);
      return { questionId:q.id, sourceId:q.sourceId||q.id, section:q.section, topic:q.topic, question:q.q, selected, expected, correct, explanation:q.explanation };
    });
    const score=section=>{const r=rows.filter(x=>x.section===section), right=r.filter(x=>x.correct).length;return {right,total:r.length,percent:r.length?right*100/r.length:100};};
    const current=score('current'), retention=score('retention');
    const right=rows.filter(x=>x.correct).length, overall=right*100/rows.length;
    const passed=overall>=90 && current.percent>=90 && retention.percent>=90;
    return { overall, current:current.percent, retention:retention.percent, right, total:rows.length, passed, rows };
  }
  return { facts, courseBanks, bank, createAttempt, grade, shuffle };
});
