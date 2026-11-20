(() => {
const K = (name, lang, code, why, o = {}) => ['cmd', { name, lang, code, why, ...o }];
const SES = { root: 's', ik: 'none' };

(window.COURSES = window.COURSES || {}).bettercap = {
  num: '01',
  title: 'Bettercap Fundamentals & Passive Network Reconnaissance',
  level: 'Beginner', category: 'Network Security', duration: 'Estimated duration: 45–60 minutes',
  desc: 'Bettercap is a modular network security tool used for network analysis, reconnaissance, and security testing. This course introduces its interface, interactive console, core commands, and passive network reconnaissance features. The practical exercises focus on understanding the tool and observing network information in an isolated, authorized lab environment.',
  ar: 'Bettercap أداة لتحليل الشبكات واختبار أمنها. سنتعلم أساسياتها وكيفية مراقبة معلومات الشبكة دون تنفيذ هجمات أو تعطيل الأجهزة.',
  sections: [
    { id: 'overview', short: 'Overview', title: 'Course Overview', items: [
      ['h', '1. Learning Objectives'],
      ['p', 'By the end of this course, students should be able to:'],
      ['ol', [
        'Understand what Bettercap is and what it is used for.',
        'Identify its main features and modules.',
        'Understand the difference between passive reconnaissance [[الاستكشاف السلبي]] and active probing [[الفحص النشط]].',
        'Identify network interfaces [[بطاقات الشبكة]] in Kali Linux.',
        'Start and navigate the Bettercap interactive console.',
        'Use basic commands such as `help`, `active`, and `net.show`.',
        'Use the `net.recon` module for passive network observation.',
        'Understand the security and privacy risks of network monitoring.']],
      ['h', '2. Ethical and Lab Requirements'],
      ['warn', 'Important: Authorized Lab Only', [
        'All practical exercises in this course must be performed on a local isolated lab network or systems that the student owns or has explicit permission to test.',
        'Do not monitor public Wi-Fi, university networks, workplace networks, or other people’s devices without authorization.',
        'This introductory course does not include credential capture, traffic interception, ARP spoofing, DNS spoofing, Wi-Fi deauthentication, or service disruption.'],
        'يجب تنفيذ التمارين داخل مختبر خاص ومعزول أو شبكة لديك تصريح صريح باختبارها.'],
      ['h', '3. Understanding Bettercap'],
      ['p', 'Bettercap is a command-line network security framework. It uses modules, where each module provides a specific function. Examples of module categories include:'],
      ['ul', ['Network reconnaissance.', 'Network probing.', 'Packet analysis.', 'Wireless network analysis.', 'Network spoofing and other security-testing capabilities.']],
      ['p', 'For this beginner course, we will focus only on the interactive console and passive network reconnaissance.'],
      ['p', '**Important distinction:**'],
      ['ul', [
        '**Passive reconnaissance:** Observing information that is already available without deliberately sending discovery probes.',
        '**Active probing:** Sending packets or requests to discover or interact with devices.']],
      ['ar', 'Passive يعني المراقبة دون إرسال طلبات استكشاف متعمدة، أما Active فيعني إرسال حزم أو طلبات للحصول على معلومات.'],
      ['h', '4. Requirements'],
      ['p', 'Students need:'],
      ['ul', ['Kali Linux.', 'Bettercap installed.', 'A terminal.', 'An isolated lab network.', 'A designated lab network interface.']],
      ['p', 'No real-world target is needed.']]},

    { id: 'lesson-1', short: '1 · Environment', title: 'Lesson 1 — Check the Environment', items: [
      ['p', 'Before starting Bettercap, identify the available network interfaces.'],
      K('Command 1 — List network interfaces', 'bash', 'ip -br link', 'Displays network interfaces in a brief format.',
        { root: 'no', ik: 'none', imp: 'None. It only displays local interface information.', exp: 'A list of network interfaces, such as `lo`, `eth0`, or `wlan0`. Actual names depend on the system.', ar: 'يعرض بطاقات الشبكة الموجودة في الجهاز وحالتها.' }),
      K('Command 2 — Show the routing table', 'bash', 'ip route', 'Displays the local routing table [[جدول التوجيه]] and helps identify the default network route.',
        { root: 'no', ik: 'none', imp: 'None. It only reads local routing information.', exp: 'A list of routes. The default route may identify the gateway [[البوابة]] and interface.', ar: 'يعرض جدول التوجيه الذي يوضح كيف يرسل الجهاز البيانات إلى الشبكات المختلفة.' }),
      K('Command 3 — Check the Bettercap version', 'bash', 'bettercap -version', 'Displays Bettercap version and build information.',
        { root: 'no', ik: 'none', imp: 'None.', exp: 'The installed Bettercap version and build information.' }),
      K('Command 4 — Show command-line help', 'bash', 'bettercap -h', 'Displays command-line options and usage information.',
        { root: 'no', ik: 'none', imp: 'None.', exp: 'A help screen with available command-line options.' })]},

    { id: 'lesson-2', short: '2 · Console', title: 'Lesson 2 — Start the Interactive Console', items: [
      ['p', 'Start Bettercap using the designated lab interface.'],
      ['p', 'Replace `<LAB_INTERFACE>` with the actual interface name from the previous exercise. For example, use the actual lab interface name shown by `ip -br link`. Do not copy the placeholder literally.'],
      K('Command 5 — Start Bettercap on the lab interface', 'bash', 'sudo bettercap -iface <LAB_INTERFACE>', 'Starts Bettercap and binds the session to the selected network interface.',
        { root: 'yes', ik: 'pm', lab: 1, imp: 'The application binds to the selected interface. This command does not itself launch an active discovery or spoofing module, but it starts a network monitoring session.', exp: 'The Bettercap interactive console opens.', ar: 'الأمر يشغّل Bettercap على بطاقة الشبكة التي تحددها. لا تستخدم بطاقة شبكة غير مخصصة للمختبر.' })]},

    { id: 'lesson-3', short: '3 · Basic commands', title: 'Lesson 3 — Basic Interactive Commands', items: [
      ['p', 'Run the following commands **inside the Bettercap console**, not in the normal Kali terminal.'],
      K('Command 6 — List commands and modules', 'bettercap', 'help', 'Displays available commands and modules.', { ...SES, imp: 'None.' }),
      K('Command 7 — Help for net.recon', 'bettercap', 'help net.recon', 'Displays help information for the `net.recon` module.', { ...SES, imp: 'None.' }),
      K('Command 8 — Show active modules', 'bettercap', 'active', 'Displays active modules and their parameters.', { ...SES, imp: 'None.' }),
      K('Command 9 — Show the interface name', 'bettercap', 'get iface.name', 'Displays the name of the interface selected for the current session.', { ...SES, imp: 'None.' }),
      K('Command 10 — Show the interface IPv4 address', 'bettercap', 'get iface.ipv4', 'Displays the IPv4 address associated with the selected interface.', { ...SES, imp: 'None.' }),
      K('Command 11 — Quit Bettercap', 'bettercap', 'quit', 'Closes the Bettercap interactive session.', { ...SES, imp: 'Stops the Bettercap session.' })]},

    { id: 'lesson-4', short: '4 · Passive recon', title: 'Lesson 4 — Passive Network Reconnaissance', items: [
      ['p', 'The `net.recon` module periodically reads the system ARP table [[جدول ARP]] to detect new hosts on the network. It is important to understand that `net.recon` and `net.probe` are different:'],
      ['ul', ['`net.recon`: Reads the system ARP table.', '`net.probe`: Sends discovery packets to IP addresses in the current subnet [[الشبكة الفرعية]].']],
      ['warn', 'Use net.recon only', ['This lesson uses `net.recon` only. Do not enable `net.probe`.']],
      K('Command 12 — Start passive host discovery', 'bettercap', 'net.recon on', 'Starts the network host discovery module. It periodically reads the system ARP table.',
        { root: 's', ik: 'pm', lab: 1, imp: 'This module reads locally available ARP-table information. It does not deliberately send the active discovery probes used by `net.probe`.', exp: 'Bettercap begins observing available host information. The results depend on what is already present in the system ARP table.', ar: 'يقرأ معلومات الأجهزة الموجودة مسبقاً في جدول ARP الخاص بالنظام.' }),
      K('Command 13 — Show collected hosts', 'bettercap', 'net.show', 'Displays the host information collected by the reconnaissance module.',
        { ...SES, imp: 'None beyond displaying collected information.', exp: 'A table of discovered or cached endpoints. It may be empty if no host information is available.' }),
      K('Command 14 — Stop passive reconnaissance', 'bettercap', 'net.recon off', 'Stops the passive network reconnaissance module.',
        { ...SES, imp: 'Stops the module. It does not modify network devices.' }),
      K('Command 15 — Clear collected endpoints', 'bettercap', 'net.clear', 'Clears the endpoints collected by the reconnaissance module from its cache.',
        { ...SES, imp: 'Clears Bettercap’s collected endpoint data; it does not remove devices or change the network.' })]},

    { id: 'lesson-5', short: '5 · Caplet', title: 'Lesson 5 — Create a Simple Passive Reconnaissance Caplet', items: [
      ['p', 'Bettercap supports automation through Caplets [[ملفات أوامر تلقائية]]. A Caplet is a text file containing Bettercap commands. For this exercise, create a file named `bettercap-passive-recon.cap` and put the following content inside it:'],
      K('bettercap-passive-recon.cap', 'caplet', 'help net.recon\nnet.recon on\nsleep 15\nnet.show\nnet.recon off\nq',
        'Automates a short passive reconnaissance session, displays the collected endpoint information, stops the module, and exits.', { wl: 'Purpose', ar: 'هذا ملف أوامر تلقائي ينفذ مراقبة قصيرة ثم يعرض النتائج ويوقف الوحدة.' }),
      ['p', 'Replace `<LAB_INTERFACE>` with the designated lab interface.'],
      K('Execution command — Run the Caplet', 'bash', 'sudo bettercap -iface <LAB_INTERFACE> -caplet ./bettercap-passive-recon.cap', 'Runs the Caplet on the designated lab interface.',
        { root: 'yes', ik: 'pm', lab: 1, imp: 'The script uses `net.recon` only. It does not enable active probing, spoofing, or packet injection.' }),
      ['h', 'Expected result'],
      ['ol', ['Bettercap displays the `net.recon` help information.', 'The reconnaissance module starts.', 'The session waits for 15 seconds.', 'Bettercap displays the available endpoint information.', 'The module stops.', 'The session exits.']],
      ['p', 'The actual endpoint results may vary.']]},

    { id: 'troubleshooting', short: 'Troubleshooting', title: 'Common Problems and Solutions', items: [
      ['prob', { t: 'Problem 1 — Bettercap command not found', cause: 'Bettercap is not installed or is not available in the system PATH.', fix: 'Verify installation and use the package manager or official installation documentation.' }],
      ['prob', { t: 'Problem 2 — Permission denied', cause: 'Bettercap needs elevated privileges to access the selected network interface.', fix: 'Start the session with `sudo` where appropriate.' }],
      ['prob', { t: 'Problem 3 — Incorrect interface name', cause: 'The selected interface does not exist or has a different name.', fix: 'Run the command below, then select the correct lab interface.',
        cmd: { name: 'List network interfaces', lang: 'bash', code: 'ip -br link' } }],
      ['prob', { t: 'Problem 4 — No hosts appear in `net.show`', cause: 'The system ARP table does not currently contain host entries.',
        fix: 'Inspect the local neighbor table using the command below. Remember that `net.recon` reads information already available in the ARP table. An empty result does not necessarily indicate a problem with Bettercap.',
        cmd: { name: 'Inspect the local neighbor table', lang: 'bash', code: 'ip neigh' } }],
      ['prob', { t: 'Problem 5 — The Caplet does not execute', cause: 'Incorrect file path or filename.', fix: 'Check that the file exists in the current directory and that its name is exactly `bettercap-passive-recon.cap`.' }]]},

    { id: 'defense', short: 'Detection & defense', title: 'Detection and Defense', items: [
      ['p', 'Understanding Bettercap also means understanding how defenders identify suspicious network activity. Important defensive practices:'],
      ['ol', [
        'Monitor unexpected changes in ARP tables.',
        'Use network monitoring tools to identify suspicious ARP behavior.',
        'Monitor unauthorized network interfaces and unexpected network monitoring processes.',
        'Use encrypted protocols such as HTTPS and SSH.',
        'Segment networks [[تقسيم الشبكة]] to reduce unnecessary exposure.',
        'Use switch security features such as Dynamic ARP Inspection where supported.',
        'Keep network equipment and operating systems updated.']],
      ['ar', 'من جانب الدفاع، راقب التغيّرات غير الطبيعية في جدول ARP، واستخدم التشفير وتقسيم الشبكة لتقليل المخاطر.']]},

    { id: 'quiz', short: 'Summary & quiz', title: 'Course Summary & Quiz', items: [
      ['p', 'In this course, students learned:'],
      ['ul', ['What Bettercap is.', 'How its modular system works.', 'How to inspect network interfaces in Kali Linux.', 'How to start the Bettercap interactive console.', 'How to use basic commands.', 'How `net.recon` works.', 'How to create and run a simple passive reconnaissance Caplet.', 'How to troubleshoot common issues.', 'How defenders can monitor and reduce network risks.']],
      ['h', 'Technical references'],
      ['refs', [['Bettercap: Interactive Session', 'https://www.bettercap.org/usage/interactive_session/'], ['Bettercap: Network Reconnaissance', 'https://www.bettercap.org/modules/ethernet/netrecon/']]],
      ['h', 'Interactive Quiz'],
      ['quiz']]}
  ],
  quiz: [
    { q: 'What is Bettercap?', o: ['A text editor', 'A modular network security tool', 'An operating system', 'A file compression tool'], a: 1,
      e: 'Bettercap is a command-line network security framework. It is built from modules, and each module provides a specific function.' },
    { q: 'Which command displays available Bettercap commands?', o: ['`help`', '`show-ip`', '`scan-all`', '`start-network`'], a: 0,
      e: '`help`, run inside the Bettercap console, lists the available commands and modules.' },
    { q: 'What does `net.recon` do?', o: ['Deletes network devices', 'Reads the system ARP table to detect hosts', 'Changes Wi-Fi passwords', 'Shuts down the network'], a: 1,
      e: '`net.recon` periodically reads the system ARP table to detect new hosts. It does not send discovery probes.' },
    { q: 'Which module sends discovery packets to IP addresses in the current subnet?', o: ['`net.show`', '`net.clear`', '`net.probe`', '`active`'], a: 2,
      e: '`net.probe` sends discovery packets, which makes it active probing. It is not used in this course.' },
    { q: 'What does `net.recon off` do?', o: ['Stops the reconnaissance module', 'Turns off Kali Linux', 'Deletes the ARP table', 'Disconnects all network devices'], a: 0,
      e: '`net.recon off` stops the module. It does not modify network devices.' },
    { q: 'What is the purpose of a Bettercap Caplet?', o: ['To update the operating system', 'To automate Bettercap commands', 'To replace the network interface', 'To create a new Wi-Fi password'], a: 1,
      e: 'A Caplet is a text file containing Bettercap commands, used to automate a session.' }
  ]
};
})();
