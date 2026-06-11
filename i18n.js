/* EN / KO dictionary. Title blocks, drawing numbers, and figure labels stay
   in English on purpose — real Korean engineering drawings keep EN annotations. */
window.I18N = {
  'nav.index':    { en: 'Home',      ko: '홈' },
  'nav.about':    { en: 'About',     ko: '소개' },
  'nav.cv':       { en: 'CV',        ko: 'CV' },
  'nav.projects': { en: 'Projects',  ko: '프로젝트' },
  'nav.personal': { en: 'Personal',  ko: '일상' },
  'nav.blog':     { en: 'Log',       ko: '기록' },
  'ui.dark':      { en: 'Dark',      ko: '다크' },
  'ui.light':     { en: 'Light',     ko: '라이트' },

  'home.tagline': { en: 'I turn drawings into <em>machines</em>.',
                    ko: '도면을 <em>기계</em>로 만듭니다.' },
  'home.cta1':    { en: 'Open the drawings <span class="arrow">&rarr;</span>',
                    ko: '도면 보기 <span class="arrow">&rarr;</span>' },
  'home.cta2':    { en: 'Data sheet (CV)', ko: '데이터 시트 (CV)' },
  'home.q.about': { en: 'About me &rarr;', ko: '소개 보기 &rarr;' },
  'home.q.email': { en: 'Email',     ko: '이메일' },
  'home.q.linkedin': { en: 'LinkedIn', ko: '링크드인' },
  'home.q.log':   { en: 'Log',       ko: '기록' },
  'home.now':     { en: 'Active work orders', ko: '진행 중인 작업' },
  'home.scroll':  { en: 'Work orders', ko: '작업 목록' },
  'home.role1.name': { en: 'Laidlaw Scholar', ko: '라이드로 장학생' },
  'home.role1.org':  { en: 'HKU LAIDLAW PROGRAMME', ko: 'HKU 라이드로 프로그램' },
  'home.role2.name': { en: 'Undergraduate Research Assistant', ko: '학부 연구조교' },
  'home.role2.org':  { en: 'HKU FACULTY OF ENGINEERING', ko: 'HKU 공과대학' },
  'home.role3.name': { en: 'HKU Racing', ko: 'HKU 레이싱' },
  'home.role3.org':  { en: 'AERODYNAMICS &amp; VEHICLE DYNAMICS', ko: '공기역학 · 차량동역학' },

  'about.h1': { en: "Hello — I'm Gihyun.", ko: '안녕하세요, 김기현입니다.' },
  'about.p1': {
    en: "I'm an engineering student at the <strong>University of Hong Kong</strong>, pursuing a combined BEng and MScEng in AI Engineering on a full scholarship. I grew up in South Korea, spent five and a half years between London and Istanbul, and now live between Hong Kong and Seoul.",
    ko: "<strong>홍콩대학교(HKU)</strong>에서 AI 공학 학·석사 통합과정을 전액 장학금으로 공부하고 있는 공학도입니다. 한국에서 태어나 런던과 이스탄불에서 5년 반을 보냈고, 지금은 홍콩과 서울을 오가며 지냅니다."
  },
  'about.p2': {
    en: "As a <strong>Laidlaw Scholar</strong>, I'm researching UAV-based analysis of urban atmospheric turbulence, and in Prof. Dong-Myeong Shin's lab I work on 3D-printed triboelectric nanogenerators for wearable sensing. Outside research, I build real hardware with the <strong>HKU Robocon</strong> and <strong>HKU Racing</strong> teams — designing, machining, and assembling parts that have to survive competition.",
    ko: "<strong>라이드로 장학생</strong>으로 도시 대기 난류의 UAV 기반 분석을 연구하고 있으며, 신동명 교수님 연구실에서는 웨어러블 센싱을 위한 3D 프린팅 마찰전기 나노발전기를 연구합니다. 연구 밖에서는 <strong>HKU 로보콘</strong>과 <strong>HKU 레이싱</strong> 팀에서 대회를 견뎌야 하는 진짜 하드웨어를 설계하고, 가공하고, 조립합니다."
  },
  'about.p3': {
    en: "The work I like best sits where mechanical design, electronics, and software meet: an idea becomes a CAD model, the model becomes a printed or machined part, and the part becomes something that actually moves. The moment a part finally fits is still my favourite part of engineering. I also enjoy teaching — I've founded study clubs and TA'd physics and math.",
    ko: "제가 가장 좋아하는 일은 기계 설계, 전자, 소프트웨어가 만나는 지점에 있습니다. 아이디어가 CAD 모델이 되고, 모델이 출력되거나 가공된 부품이 되고, 그 부품이 실제로 움직이는 무언가가 되는 과정 — 부품이 마침내 딱 맞아 들어가는 순간이 지금도 공학에서 제일 좋아하는 순간입니다. 가르치는 것도 좋아해서 스터디 클럽을 만들고 물리·수학 조교를 했습니다."
  },
  'about.p4': {
    en: 'This site is organised like a drawing set: a <a href="cv.html">data sheet (CV)</a>, the <a href="projects.html">project drawings</a> — with live 3D models and revision histories — and an <a href="blog.html">engineering log</a> for research notes.',
    ko: '이 사이트는 도면 세트처럼 구성되어 있습니다: <a href="cv.html">데이터 시트(CV)</a>, 라이브 3D 모델과 개정 이력이 담긴 <a href="projects.html">프로젝트 도면</a>, 그리고 연구 노트를 위한 <a href="blog.html">엔지니어링 로그</a>.'
  },
  'about.f1k': { en: 'Based in',  ko: '거점' },
  'about.f1v': { en: 'Hong Kong / Seoul', ko: '홍콩 · 서울' },
  'about.f2k': { en: 'Studying',  ko: '전공' },
  'about.f2v': { en: 'AI Engineering', ko: 'AI 공학' },
  'about.f3k': { en: 'Focus',     ko: '관심' },
  'about.f3v': { en: 'Robotics &amp; Applied AI', ko: '로보틱스 · 응용 AI' },

  'projects.sub': {
    en: 'Four builds — drawn, machined, printed, and assembled. Drag a model to rotate it; open a card for the full sheet, including its revision history.',
    ko: '네 가지 제작물 — 설계하고, 가공하고, 출력하고, 조립했습니다. 모델을 드래그해 돌려 보고, 카드를 열면 개정 이력이 담긴 전체 도면을 볼 수 있습니다.'
  },

  'personal.sub': {
    en: "The as-built drawing — what I'm listening to, the route that got me here, and everyday moments along the way.",
    ko: '준공 도면 — 요즘 듣는 음악, 여기까지 온 경로, 그리고 그 길 위의 일상.'
  },
  'personal.h2map':   { en: 'Route to date', ko: '지금까지의 경로' },
  'personal.h2songs': { en: 'On repeat', ko: '요즘 듣는 노래' },
  'personal.h2daily': { en: 'Daily life', ko: '일상' },
  'personal.dailynote': {
    en: 'A few moments, in order — home, school, and the road since.',
    ko: '몇 장의 순간들, 시간 순서대로 — 집, 학교, 그리고 그 뒤의 길.'
  },

  'blog.sub': {
    en: 'Research progress, build notes, and the occasional detour — newest first.',
    ko: '연구 진행 상황과 제작 기록, 그리고 가끔의 샛길 — 최신순.'
  }
};
