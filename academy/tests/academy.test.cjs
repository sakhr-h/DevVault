const assert = require('node:assert/strict');
const C = require('../assets/curriculum.js');
const S = require('../assets/state.js');
const A = require('../assets/assessments.js');

const resetMemory = () => Object.keys(S._memory).forEach(k => delete S._memory[k]);
const set = (k,v) => { S._memory[k] = JSON.stringify(v); };

assert.equal(C.courses.length, 27, 'registry has 27 unique courses');
assert.equal(new Set(C.courses.map(c=>c.id)).size, 27, 'course IDs are unique');
assert.deepEqual(C.stageById['stage-0'].courses, ['html-fundamentals','javascript-fundamentals','python-fundamentals','kali','http-web-security','network-logs']);
assert.deepEqual(C.trackById['track-a'].courses, ['pentest-methodology','owasp-safe-labs','privilege-defenses','pentest-reporting']);
assert.equal(C.trackById['track-b'].courses.length, 6);

for (const target of [...C.stages.slice(0,5), ...C.tracks]) {
  assert.ok(A.bank(target.id).length > 20, `${target.id} bank is larger than a displayed assessment`);
  const attempt=A.createAttempt(target.id, (()=>{let n=0;return()=>((n++*0.371)%1);})());
  assert.equal(attempt.questions.length,20,`${target.id} displays 20 questions`);
  assert.equal(new Set(attempt.questions.map(q=>q.id)).size,20,`${target.id} has no duplicate displayed IDs`);
}

const sample=A.createAttempt('stage-0',()=>0.42);
const perfect=Object.fromEntries(sample.questions.map(q=>[q.id,q.correct]));
assert.equal(A.grade(sample,perfect).overall,100);
assert.equal(A.grade(sample,perfect).passed,true);
const oneWrong={...perfect,[sample.questions[0].id]:[99]};
assert.equal(A.grade(sample,oneWrong).overall,95);
assert.equal(A.grade(sample,oneWrong).passed,true);
const threeWrong={...perfect};sample.questions.slice(0,3).forEach(q=>threeWrong[q.id]=[99]);
assert.equal(A.grade(sample,threeWrong).overall,85);
assert.equal(A.grade(sample,threeWrong).passed,false);
assert.equal(90>=90,true,'exactly 90 passes');
assert.equal(89.99>=90,false,'89.99 fails');

const retained=A.createAttempt('stage-3',()=>0.37);
const retainedPerfect=Object.fromEntries(retained.questions.map(q=>[q.id,q.correct]));
const oneEach={...retainedPerfect};
oneEach[retained.questions.find(q=>q.section==='current').id]=[99];
oneEach[retained.questions.find(q=>q.section==='retention').id]=[99];
const exactBoundary=A.grade(retained,oneEach);
assert.deepEqual([exactBoundary.overall,exactBoundary.current,exactBoundary.retention,exactBoundary.passed],[90,90,90,true]);
const retentionFail={...retainedPerfect};
retained.questions.filter(q=>q.section==='retention').slice(0,2).forEach(q=>retentionFail[q.id]=[99]);
const sectionBoundary=A.grade(retained,retentionFail);
assert.equal(sectionBoundary.overall,90);
assert.equal(sectionBoundary.retention,80);
assert.equal(sectionBoundary.passed,false,'overall 90 cannot hide a retention-section failure');

resetMemory();
set(S.OLD_PROGRESS,{bettercap:{done:{overview:1,quiz:1},best:3}});
set(S.OLD_AR,false);
const migrated=S.migrate();
assert.equal(migrated.schemaVersion,2);
assert.equal(migrated.preferences.arabicHints,false);
assert.equal(migrated.courses.bettercap.completedActivities.overview,true);
assert.equal(migrated.courses.bettercap.bestQuizScore,100);
assert.ok(S._memory[S.OLD_PROGRESS],'legacy progress is preserved');
const once=JSON.stringify(S.load());S.migrate();assert.equal(JSON.stringify(S.load()),once,'migration is idempotent');

resetMemory();S.migrate();
assert.equal(S.stageUnlocked(0),true);
assert.equal(S.stageUnlocked(1),false);
for(const id of C.stageById['stage-0'].courses){S.registerActivities(id,['a','quiz']);S.setActivity(id,'a',true);S.setActivity(id,'quiz',true);S.recordQuiz(id,{score:7,total:10,percent:70});}
assert.equal(S.targetReady('stage-0'),true);
S.recordAssessment('stage-0',{overall:90,current:90,retention:100,passed:true});
assert.equal(S.stageUnlocked(1),true);

resetMemory();S.migrate();
S.addWeakness({questionId:'q1',targetId:'stage-0',topic:'Test',question:'Q?',selected:'A',correctAnswer:'B'});
S.addWeakness({questionId:'q1',targetId:'stage-0',topic:'Test',question:'Q?',selected:'A',correctAnswer:'B'});
assert.equal(Object.keys(S.load().weaknesses).length,1);
assert.equal(Object.values(S.load().weaknesses)[0].count,2);

console.log('Academy tests passed');
