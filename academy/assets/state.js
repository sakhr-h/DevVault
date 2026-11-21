(function (root, factory) {
  const api = factory(root.AcademyCurriculum || (typeof require === 'function' ? require('./curriculum.js') : null));
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.AcademyState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (curriculum) {
  'use strict';
  const KEY = 'devvault_academy_state_v2';
  const OLD_PROGRESS = 'acad_progress_v1';
  const OLD_AR = 'acad_ar';
  const now = () => new Date().toISOString();
  const blank = () => ({
    schemaVersion:2,
    profile:{ createdAt:now(), updatedAt:now() },
    preferences:{ arabicHints:true },
    courses:{}, assessments:{}, weaknesses:{},
    migration:{ version:2, completed:false, sourceKeys:[], completedAt:null }
  });
  const memory = {};
  const storage = () => {
    if (typeof localStorage !== 'undefined') return localStorage;
    return { getItem:k => Object.prototype.hasOwnProperty.call(memory,k) ? memory[k] : null, setItem:(k,v)=>{ memory[k]=String(v); }, removeItem:k=>{ delete memory[k]; } };
  };
  const parse = (s, fallback) => { try { const v = JSON.parse(s); return v == null ? fallback : v; } catch (_) { return fallback; } };
  const normalize = raw => {
    const b = blank(), s = raw && typeof raw === 'object' ? raw : {};
    return {
      schemaVersion:2,
      profile:{...b.profile,...(s.profile||{})},
      preferences:{...b.preferences,...(s.preferences||{})},
      courses:s.courses && typeof s.courses==='object' ? s.courses : {},
      assessments:s.assessments && typeof s.assessments==='object' ? s.assessments : {},
      weaknesses:s.weaknesses && typeof s.weaknesses==='object' ? s.weaknesses : {},
      migration:{...b.migration,...(s.migration||{})}
    };
  };
  function migrate() {
    const db = storage();
    const existing = parse(db.getItem(KEY), null);
    if (existing && existing.schemaVersion === 2 && existing.migration && existing.migration.completed) return normalize(existing);
    const state = normalize(existing);
    const oldProgress = parse(db.getItem(OLD_PROGRESS), {});
    const oldAr = parse(db.getItem(OLD_AR), null);
    if (db.getItem(OLD_PROGRESS) !== null) state.migration.sourceKeys.push(OLD_PROGRESS);
    if (db.getItem(OLD_AR) !== null) state.migration.sourceKeys.push(OLD_AR);
    Object.entries(oldProgress || {}).forEach(([courseId, old]) => {
      const c = state.courses[courseId] = state.courses[courseId] || { completedActivities:{}, quizAttempts:[], bestQuizScore:0 };
      Object.keys((old && old.done) || {}).forEach(id => { c.completedActivities[id] = true; });
      if (Number.isFinite(Number(old && old.best))) {
        const legacyRaw=Number(old.best)||0, legacyPercent=legacyRaw<=3 ? legacyRaw*100/3 : legacyRaw;
        c.bestQuizScore = Math.max(Number(c.bestQuizScore)||0, legacyPercent);
        if (!c.quizAttempts.some(a=>a.migrated)) c.quizAttempts.push({ score:legacyRaw, total:legacyRaw<=3?3:null, percent:legacyPercent, at:now(), migrated:true });
      }
    });
    if (typeof oldAr === 'boolean') state.preferences.arabicHints = oldAr;
    state.migration = { version:2, completed:true, sourceKeys:[...new Set(state.migration.sourceKeys)], completedAt:now() };
    save(state);
    return state;
  }
  function load() { return migrate(); }
  function save(input) {
    const state = normalize(input); state.profile.updatedAt = now();
    storage().setItem(KEY, JSON.stringify(state)); return state;
  }
  function update(fn) { const state = load(); fn(state); return save(state); }
  function preference(name, value) {
    if (arguments.length === 1) return load().preferences[name];
    update(s => { s.preferences[name] = value; }); return value;
  }
  function course(id) {
    const c = load().courses[id] || {};
    return { completedActivities:{}, requiredActivities:[], quizAttempts:[], bestQuizScore:0, ...c };
  }
  function registerActivities(id, ids) {
    update(s => {
      const c = s.courses[id] = s.courses[id] || { completedActivities:{}, quizAttempts:[], bestQuizScore:0 };
      c.requiredActivities = [...new Set(ids)];
    });
  }
  function setActivity(id, activity, done) {
    update(s => {
      const c = s.courses[id] = s.courses[id] || { completedActivities:{}, quizAttempts:[], bestQuizScore:0 };
      c.completedActivities = c.completedActivities || {};
      if (done) c.completedActivities[activity] = true; else delete c.completedActivities[activity];
    });
  }
  function recordQuiz(id, result) {
    update(s => {
      const c = s.courses[id] = s.courses[id] || { completedActivities:{}, quizAttempts:[], bestQuizScore:0 };
      c.quizAttempts = c.quizAttempts || [];
      c.quizAttempts.push({ ...result, at:now() });
      c.bestQuizScore = Math.max(Number(c.bestQuizScore)||0, Number(result.percent)||0);
      c.latestQuizScore = Number(result.percent)||0;
    });
  }
  function courseProgress(id) {
    const c = course(id), req = c.requiredActivities || [];
    const completed = req.filter(x => c.completedActivities && c.completedActivities[x]).length;
    const percent = req.length ? Math.round(completed * 100 / req.length) : 0;
    return { completed, total:req.length, percent, quizBest:Number(c.bestQuizScore)||0, complete:req.length>0 && completed===req.length && (Number(c.bestQuizScore)||0)>=70 };
  }
  function targetCourses(targetId) {
    if (curriculum.stageById[targetId]) return curriculum.stageById[targetId].courses;
    if (curriculum.trackById[targetId]) return curriculum.trackById[targetId].courses;
    return [];
  }
  function targetReady(targetId) { const ids=targetCourses(targetId); return ids.length>0 && ids.every(id=>courseProgress(id).complete); }
  function attempts(targetId) { return (load().assessments[targetId] || {}).attempts || []; }
  function bestAttempt(targetId) { return attempts(targetId).slice().sort((a,b)=>b.overall-a.overall)[0] || null; }
  function latestAttempt(targetId) { const a=attempts(targetId); return a[a.length-1] || null; }
  function isMastered(targetId) { return attempts(targetId).some(a => a.passed === true); }
  function recordAssessment(targetId, result) {
    update(s => {
      const a = s.assessments[targetId] = s.assessments[targetId] || { attempts:[] };
      a.attempts.push({ ...result, at:now() });
    });
  }
  function stageUnlocked(number) {
    if (number === 0) return true;
    if (number === 5) return isMastered('stage-4');
    return isMastered('stage-' + (number - 1));
  }
  function courseAccess(courseId) {
    const meta = curriculum.byId[courseId];
    if (!meta) return { unlocked:false, reason:'Unknown course.' };
    const unlocked = stageUnlocked(meta.stage);
    return unlocked ? { unlocked:true, reason:'' } : { unlocked:false, reason:`Master Stage ${meta.stage-1} to unlock this course.` };
  }
  function targetStatus(targetId) {
    const isTrack = !!curriculum.trackById[targetId];
    const stage = isTrack ? curriculum.stageById['stage-5'] : curriculum.stageById[targetId];
    const unlocked = stage ? stageUnlocked(stage.number) : false;
    if (!unlocked) return 'Locked';
    if (isMastered(targetId)) return 'Mastered';
    if (attempts(targetId).length && !latestAttempt(targetId).passed) return 'Retry Required';
    if (targetReady(targetId)) return 'Gate Ready';
    return 'In Progress';
  }
  function addWeakness(entry) {
    const key = entry.questionId + '::' + (entry.targetId || entry.courseId || 'general');
    update(s => {
      const old = s.weaknesses[key];
      s.weaknesses[key] = old ? { ...old, ...entry, count:(old.count||1)+1, lastSeenAt:now() } : { ...entry, key, count:1, status:'unreviewed', firstSeenAt:now(), lastSeenAt:now() };
    });
  }
  function setWeaknessStatus(key, status) { update(s=>{ if(s.weaknesses[key]) s.weaknesses[key].status=status; }); }
  function resetProgress() {
    const current=load(), fresh=blank();
    fresh.preferences={...current.preferences};
    fresh.migration={...current.migration};
    save(fresh);
  }
  function snapshot() { return JSON.parse(JSON.stringify(load())); }
  return { KEY, OLD_PROGRESS, OLD_AR, load, save, migrate, preference, course, registerActivities, setActivity, recordQuiz, courseProgress, targetReady, attempts, bestAttempt, latestAttempt, isMastered, recordAssessment, stageUnlocked, courseAccess, targetStatus, addWeakness, setWeaknessStatus, resetProgress, snapshot, _memory:memory };
});
