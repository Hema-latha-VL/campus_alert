export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export interface MockTest {
  id: string;
  title: string;
  category: 'computer' | 'electrical';
  description: string;
  questions: Question[];
}

export const mockTests: MockTest[] = [
  {
    id: 'computer-networks',
    title: 'Computer Networks',
    category: 'computer',
    description: 'Test your knowledge of networking concepts, protocols, and architectures',
    questions: [
      {
        id: 'cn1',
        question: 'What is the primary purpose of the OSI model?',
        options: [
          'To provide a framework for understanding network communications',
          'To encrypt data transmission',
          'To compress network traffic',
          'To manage user authentication'
        ],
        correctAnswer: 0,
        explanation: 'The OSI model provides a conceptual framework for understanding how different network protocols interact and communicate.'
      },
      {
        id: 'cn2',
        question: 'Which layer of the OSI model is responsible for routing?',
        options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        correctAnswer: 2,
        explanation: 'The Network Layer (Layer 3) handles routing and forwarding of packets between networks.'
      },
      {
        id: 'cn3',
        question: 'What does TCP stand for?',
        options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Transport Connection Protocol', 'Transfer Connection Protocol'],
        correctAnswer: 1
      },
      {
        id: 'cn4',
        question: 'Which protocol is connectionless?',
        options: ['TCP', 'UDP', 'FTP', 'HTTP'],
        correctAnswer: 1,
        explanation: 'UDP (User Datagram Protocol) is connectionless and does not guarantee delivery.'
      },
      {
        id: 'cn5',
        question: 'What is the maximum size of an IPv4 address?',
        options: ['16 bits', '32 bits', '64 bits', '128 bits'],
        correctAnswer: 1
      },
      {
        id: 'cn6',
        question: 'Which device operates at the Data Link layer?',
        options: ['Router', 'Switch', 'Hub', 'Gateway'],
        correctAnswer: 1
      },
      {
        id: 'cn7',
        question: 'What is the default subnet mask for a Class C network?',
        options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
        correctAnswer: 2
      },
      {
        id: 'cn8',
        question: 'Which protocol is used for secure web browsing?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
        correctAnswer: 2
      },
      {
        id: 'cn9',
        question: 'What does DNS stand for?',
        options: ['Domain Name System', 'Dynamic Network Service', 'Domain Network System', 'Digital Name Service'],
        correctAnswer: 0
      },
      {
        id: 'cn10',
        question: 'Which port number is used by HTTP?',
        options: ['21', '25', '80', '443'],
        correctAnswer: 2
      },
      {
        id: 'cn11',
        question: 'What is the purpose of ARP?',
        options: ['Resolve IP to MAC address', 'Resolve domain names', 'Route packets', 'Encrypt data'],
        correctAnswer: 0
      },
      {
        id: 'cn12',
        question: 'Which topology connects all devices in a circular chain?',
        options: ['Star', 'Bus', 'Ring', 'Mesh'],
        correctAnswer: 2
      },
      {
        id: 'cn13',
        question: 'What is the range of well-known port numbers?',
        options: ['0-1023', '1024-49151', '49152-65535', '0-65535'],
        correctAnswer: 0
      },
      {
        id: 'cn14',
        question: 'Which protocol is used for email transmission?',
        options: ['POP3', 'IMAP', 'SMTP', 'FTP'],
        correctAnswer: 2
      },
      {
        id: 'cn15',
        question: 'What does MAC stand for in networking?',
        options: ['Machine Access Control', 'Media Access Control', 'Multiple Access Control', 'Memory Access Control'],
        correctAnswer: 1
      },
      {
        id: 'cn16',
        question: 'Which layer handles error detection and correction?',
        options: ['Physical', 'Data Link', 'Network', 'Transport'],
        correctAnswer: 1
      },
      {
        id: 'cn17',
        question: 'What is the size of an IPv6 address?',
        options: ['32 bits', '64 bits', '128 bits', '256 bits'],
        correctAnswer: 2
      },
      {
        id: 'cn18',
        question: 'Which protocol uses port 443?',
        options: ['HTTP', 'FTP', 'HTTPS', 'SSH'],
        correctAnswer: 2
      },
      {
        id: 'cn19',
        question: 'What is the maximum transmission unit (MTU) for Ethernet?',
        options: ['1024 bytes', '1500 bytes', '2048 bytes', '4096 bytes'],
        correctAnswer: 1
      },
      {
        id: 'cn20',
        question: 'Which device operates at all layers of the OSI model?',
        options: ['Router', 'Switch', 'Gateway', 'Bridge'],
        correctAnswer: 2
      },
      {
        id: 'cn21',
        question: 'What does DHCP stand for?',
        options: ['Dynamic Host Configuration Protocol', 'Domain Host Control Protocol', 'Dynamic Host Control Protocol', 'Domain Host Configuration Protocol'],
        correctAnswer: 0
      },
      {
        id: 'cn22',
        question: 'Which protocol is used for file transfer?',
        options: ['HTTP', 'FTP', 'SMTP', 'DNS'],
        correctAnswer: 1
      },
      {
        id: 'cn23',
        question: 'What is the loopback IP address?',
        options: ['192.168.0.1', '127.0.0.1', '10.0.0.1', '172.16.0.1'],
        correctAnswer: 1
      },
      {
        id: 'cn24',
        question: 'Which layer is responsible for session management?',
        options: ['Transport', 'Session', 'Presentation', 'Application'],
        correctAnswer: 1
      },
      {
        id: 'cn25',
        question: 'What does NAT stand for?',
        options: ['Network Address Translation', 'Network Access Translation', 'Node Address Translation', 'Network Allocation Table'],
        correctAnswer: 0
      },
      {
        id: 'cn26',
        question: 'Which protocol is connection-oriented?',
        options: ['UDP', 'ICMP', 'TCP', 'IP'],
        correctAnswer: 2
      },
      {
        id: 'cn27',
        question: 'What is the broadcast address for 192.168.1.0/24?',
        options: ['192.168.1.0', '192.168.1.255', '192.168.1.1', '192.168.1.254'],
        correctAnswer: 1
      },
      {
        id: 'cn28',
        question: 'Which protocol is used to test network connectivity?',
        options: ['TCP', 'UDP', 'ICMP', 'ARP'],
        correctAnswer: 2
      },
      {
        id: 'cn29',
        question: 'What does VPN stand for?',
        options: ['Virtual Private Network', 'Virtual Public Network', 'Variable Private Network', 'Virtual Protocol Network'],
        correctAnswer: 0
      },
      {
        id: 'cn30',
        question: 'Which device can filter traffic based on MAC addresses?',
        options: ['Router', 'Switch', 'Hub', 'Repeater'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'operating-systems',
    title: 'Operating Systems',
    category: 'computer',
    description: 'Explore OS concepts including processes, memory management, and scheduling',
    questions: [
      {
        id: 'os1',
        question: 'What is an operating system?',
        options: ['Hardware component', 'Software that manages hardware and software resources', 'Application software', 'Programming language'],
        correctAnswer: 1
      },
      {
        id: 'os2',
        question: 'Which scheduling algorithm is non-preemptive?',
        options: ['Round Robin', 'FCFS (First Come First Serve)', 'Priority Scheduling with preemption', 'Shortest Remaining Time First'],
        correctAnswer: 1
      },
      {
        id: 'os3',
        question: 'What is a deadlock?',
        options: ['System crash', 'Set of processes blocked waiting for each other', 'Memory overflow', 'CPU overload'],
        correctAnswer: 1
      },
      {
        id: 'os4',
        question: 'Which memory allocation technique divides memory into fixed-size partitions?',
        options: ['Paging', 'Segmentation', 'Dynamic partitioning', 'Buddy system'],
        correctAnswer: 0
      },
      {
        id: 'os5',
        question: 'What is thrashing?',
        options: ['CPU overutilization', 'Excessive page swapping', 'Disk failure', 'Network congestion'],
        correctAnswer: 1
      },
      {
        id: 'os6',
        question: 'Which of the following is NOT a necessary condition for deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Circular Wait', 'Preemption'],
        correctAnswer: 3,
        explanation: 'No Preemption (not Preemption) is one of the four necessary conditions for deadlock.'
      },
      {
        id: 'os7',
        question: 'What is virtual memory?',
        options: ['RAM', 'ROM', 'Extension of physical memory using disk space', 'Cache memory'],
        correctAnswer: 2
      },
      {
        id: 'os8',
        question: 'Which system call is used to create a new process?',
        options: ['fork()', 'exec()', 'wait()', 'exit()'],
        correctAnswer: 0
      },
      {
        id: 'os9',
        question: 'What is a semaphore?',
        options: ['Hardware component', 'Synchronization tool', 'Memory allocation technique', 'Scheduling algorithm'],
        correctAnswer: 1
      },
      {
        id: 'os10',
        question: 'Which page replacement algorithm is optimal?',
        options: ['FIFO', 'LRU', 'Replace page not used for longest time in future', 'Clock algorithm'],
        correctAnswer: 2
      },
      {
        id: 'os11',
        question: 'What is the size of a page typically?',
        options: ['512 bytes', '1 KB', '4 KB', '1 MB'],
        correctAnswer: 2
      },
      {
        id: 'os12',
        question: 'Which scheduling algorithm is best for time-sharing systems?',
        options: ['FCFS', 'SJF', 'Round Robin', 'Priority'],
        correctAnswer: 2
      },
      {
        id: 'os13',
        question: 'What is a critical section?',
        options: ['Important code', 'Code accessing shared resources', 'System code', 'Error handling code'],
        correctAnswer: 1
      },
      {
        id: 'os14',
        question: 'Which of the following is a real-time operating system?',
        options: ['Windows', 'Linux', 'VxWorks', 'macOS'],
        correctAnswer: 2
      },
      {
        id: 'os15',
        question: 'What is internal fragmentation?',
        options: ['Disk fragmentation', 'Wasted space within allocated memory', 'Memory leak', 'Buffer overflow'],
        correctAnswer: 1
      },
      {
        id: 'os16',
        question: 'Which command is used to list processes in Linux?',
        options: ['list', 'show', 'ps', 'proc'],
        correctAnswer: 2
      },
      {
        id: 'os17',
        question: 'What is a zombie process?',
        options: ['Dead process', 'Process that has completed but still has entry in process table', 'Sleeping process', 'Suspended process'],
        correctAnswer: 1
      },
      {
        id: 'os18',
        question: 'Which file system is commonly used in Windows?',
        options: ['ext4', 'NTFS', 'HFS+', 'ZFS'],
        correctAnswer: 1
      },
      {
        id: 'os19',
        question: 'What does IPC stand for?',
        options: ['Internet Protocol Communication', 'Inter-Process Communication', 'Internal Process Control', 'Integrated Program Control'],
        correctAnswer: 1
      },
      {
        id: 'os20',
        question: 'Which memory management scheme eliminates external fragmentation?',
        options: ['Segmentation', 'Paging', 'Contiguous allocation', 'Linked allocation'],
        correctAnswer: 1
      },
      {
        id: 'os21',
        question: 'What is a context switch?',
        options: ['Program termination', 'Saving and loading process state', 'Memory allocation', 'I/O operation'],
        correctAnswer: 1
      },
      {
        id: 'os22',
        question: 'Which algorithm prevents starvation?',
        options: ['FCFS', 'Priority without aging', 'SJF', 'Priority with aging'],
        correctAnswer: 3
      },
      {
        id: 'os23',
        question: 'What is the kernel?',
        options: ['User interface', 'Core of the operating system', 'Application layer', 'Hardware driver'],
        correctAnswer: 1
      },
      {
        id: 'os24',
        question: 'Which of the following is a preemptive scheduling algorithm?',
        options: ['FCFS', 'SJF (non-preemptive)', 'Round Robin', 'None'],
        correctAnswer: 2
      },
      {
        id: 'os25',
        question: 'What is a daemon process?',
        options: ['Malware', 'Background service process', 'System error', 'User process'],
        correctAnswer: 1
      },
      {
        id: 'os26',
        question: 'Which layer of OS interacts directly with hardware?',
        options: ['Application layer', 'System call layer', 'Kernel', 'Shell'],
        correctAnswer: 2
      },
      {
        id: 'os27',
        question: 'What is the purpose of the swap space?',
        options: ['Store programs', 'Virtual memory extension', 'Cache data', 'Store user files'],
        correctAnswer: 1
      },
      {
        id: 'os28',
        question: 'Which technique is used to prevent deadlock?',
        options: ['Detection and recovery', 'Prevention', 'Avoidance', 'All of the above'],
        correctAnswer: 3
      },
      {
        id: 'os29',
        question: 'What is a mutex?',
        options: ['Memory unit', 'Mutual exclusion lock', 'Message queue', 'Monitor'],
        correctAnswer: 1
      },
      {
        id: 'os30',
        question: 'Which system call is used to execute a new program?',
        options: ['fork()', 'exec()', 'wait()', 'kill()'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    category: 'computer',
    description: 'Test your understanding of databases, SQL, normalization, and transactions',
    questions: [
      {
        id: 'db1',
        question: 'What does DBMS stand for?',
        options: ['Data Block Management System', 'Database Management System', 'Data Basic Management System', 'Database Manipulation System'],
        correctAnswer: 1
      },
      {
        id: 'db2',
        question: 'Which normal form eliminates partial dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 1
      },
      {
        id: 'db3',
        question: 'What is a primary key?',
        options: ['First column', 'Unique identifier for a record', 'Foreign key reference', 'Index'],
        correctAnswer: 1
      },
      {
        id: 'db4',
        question: 'Which SQL command is used to retrieve data?',
        options: ['GET', 'FETCH', 'SELECT', 'RETRIEVE'],
        correctAnswer: 2
      },
      {
        id: 'db5',
        question: 'What does ACID stand for in database transactions?',
        options: ['Atomicity, Consistency, Isolation, Durability', 'Addition, Consistency, Isolation, Deletion', 'Atomicity, Correctness, Integration, Durability', 'Addition, Correctness, Isolation, Deletion'],
        correctAnswer: 0
      },
      {
        id: 'db6',
        question: 'Which join returns all records from both tables?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
        correctAnswer: 3
      },
      {
        id: 'db7',
        question: 'What is normalization?',
        options: ['Data encryption', 'Organizing data to reduce redundancy', 'Database backup', 'Query optimization'],
        correctAnswer: 1
      },
      {
        id: 'db8',
        question: 'Which command is used to delete a table?',
        options: ['DELETE TABLE', 'DROP TABLE', 'REMOVE TABLE', 'ERASE TABLE'],
        correctAnswer: 1
      },
      {
        id: 'db9',
        question: 'What is a foreign key?',
        options: ['Key from another database', 'Reference to primary key in another table', 'Encryption key', 'Backup key'],
        correctAnswer: 1
      },
      {
        id: 'db10',
        question: 'Which clause is used to filter groups in SQL?',
        options: ['WHERE', 'FILTER', 'HAVING', 'GROUP'],
        correctAnswer: 2
      },
      {
        id: 'db11',
        question: 'What is an index in a database?',
        options: ['Table of contents', 'Data structure for faster retrieval', 'Primary key', 'Foreign key'],
        correctAnswer: 1
      },
      {
        id: 'db12',
        question: 'Which type of relationship connects one record to many records?',
        options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'None'],
        correctAnswer: 1
      },
      {
        id: 'db13',
        question: 'What does SQL stand for?',
        options: ['Simple Query Language', 'Structured Query Language', 'Standard Query Language', 'System Query Language'],
        correctAnswer: 1
      },
      {
        id: 'db14',
        question: 'Which constraint ensures data integrity?',
        options: ['CHECK', 'NOT NULL', 'UNIQUE', 'All of the above'],
        correctAnswer: 3
      },
      {
        id: 'db15',
        question: 'What is a view in SQL?',
        options: ['Physical table', 'Virtual table based on query', 'Index', 'Constraint'],
        correctAnswer: 1
      },
      {
        id: 'db16',
        question: 'Which isolation level allows dirty reads?',
        options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
        correctAnswer: 0
      },
      {
        id: 'db17',
        question: 'What is denormalization?',
        options: ['Removing normalization', 'Adding redundancy for performance', 'Database error', 'Backup process'],
        correctAnswer: 1
      },
      {
        id: 'db18',
        question: 'Which command is used to modify table structure?',
        options: ['MODIFY', 'ALTER', 'CHANGE', 'UPDATE'],
        correctAnswer: 1
      },
      {
        id: 'db19',
        question: 'What is a stored procedure?',
        options: ['Saved data', 'Precompiled SQL statements', 'Table backup', 'Index type'],
        correctAnswer: 1
      },
      {
        id: 'db20',
        question: 'Which normal form removes transitive dependencies?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctAnswer: 2
      },
      {
        id: 'db21',
        question: 'What is a trigger?',
        options: ['Start button', 'Automatic procedure on table event', 'Error handler', 'User command'],
        correctAnswer: 1
      },
      {
        id: 'db22',
        question: 'Which SQL function returns the number of rows?',
        options: ['SUM()', 'AVG()', 'COUNT()', 'TOTAL()'],
        correctAnswer: 2
      },
      {
        id: 'db23',
        question: 'What is a candidate key?',
        options: ['Foreign key', 'Potential primary key', 'Composite key', 'Alternate key'],
        correctAnswer: 1
      },
      {
        id: 'db24',
        question: 'Which command is used to grant permissions?',
        options: ['ALLOW', 'GRANT', 'PERMIT', 'GIVE'],
        correctAnswer: 1
      },
      {
        id: 'db25',
        question: 'What is a composite key?',
        options: ['Multiple tables', 'Key with multiple columns', 'Foreign key', 'Index'],
        correctAnswer: 1
      },
      {
        id: 'db26',
        question: 'Which clause is used for pattern matching?',
        options: ['MATCH', 'LIKE', 'SIMILAR', 'PATTERN'],
        correctAnswer: 1
      },
      {
        id: 'db27',
        question: 'What is referential integrity?',
        options: ['Data backup', 'Foreign key constraint validity', 'Primary key uniqueness', 'Index consistency'],
        correctAnswer: 1
      },
      {
        id: 'db28',
        question: 'Which command commits a transaction?',
        options: ['SAVE', 'COMMIT', 'END', 'FINISH'],
        correctAnswer: 1
      },
      {
        id: 'db29',
        question: 'What is a schema?',
        options: ['Database structure', 'Query plan', 'Backup file', 'User account'],
        correctAnswer: 0
      },
      {
        id: 'db30',
        question: 'Which type of JOIN returns only matching records?',
        options: ['OUTER JOIN', 'FULL JOIN', 'INNER JOIN', 'CROSS JOIN'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'digital-electronics',
    title: 'Digital Electronics',
    category: 'electrical',
    description: 'Fundamentals of digital logic, gates, and circuits',
    questions: [
      {
        id: 'de1',
        question: 'What is the output of an AND gate when both inputs are 1?',
        options: ['0', '1', 'Undefined', 'High impedance'],
        correctAnswer: 1
      },
      {
        id: 'de2',
        question: 'Which gate produces output 1 only when inputs are different?',
        options: ['AND', 'OR', 'XOR', 'NAND'],
        correctAnswer: 2
      },
      {
        id: 'de3',
        question: 'What is a flip-flop?',
        options: ['Logic gate', 'Memory element', 'Amplifier', 'Resistor'],
        correctAnswer: 1
      },
      {
        id: 'de4',
        question: 'How many input combinations are possible for a 3-input logic gate?',
        options: ['3', '6', '8', '9'],
        correctAnswer: 2
      },
      {
        id: 'de5',
        question: 'What is the binary equivalent of decimal 15?',
        options: ['1010', '1100', '1111', '1001'],
        correctAnswer: 2
      },
      {
        id: 'de6',
        question: 'Which flip-flop toggles on every clock pulse?',
        options: ['SR', 'D', 'JK', 'T'],
        correctAnswer: 3
      },
      {
        id: 'de7',
        question: 'What is the output of a NOT gate for input 1?',
        options: ['0', '1', 'Floating', 'Error'],
        correctAnswer: 0
      },
      {
        id: 'de8',
        question: 'Which number system uses base 16?',
        options: ['Binary', 'Octal', 'Decimal', 'Hexadecimal'],
        correctAnswer: 3
      },
      {
        id: 'de9',
        question: 'What is a multiplexer?',
        options: ['Memory chip', 'Data selector', 'Amplifier', 'Power supply'],
        correctAnswer: 1
      },
      {
        id: 'de10',
        question: 'How many outputs does a 1-to-4 demultiplexer have?',
        options: ['1', '2', '4', '8'],
        correctAnswer: 2
      },
      {
        id: 'de11',
        question: 'What is the complement of A + B in Boolean algebra?',
        options: ['A\' + B\'', 'A\' · B\'', 'A · B', 'A + B\''],
        correctAnswer: 1,
        explanation: 'According to De Morgan\'s theorem, (A + B)\' = A\' · B\''
      },
      {
        id: 'de12',
        question: 'Which logic family is fastest?',
        options: ['TTL', 'CMOS', 'ECL', 'DTL'],
        correctAnswer: 2
      },
      {
        id: 'de13',
        question: 'What is a decoder?',
        options: ['Converts binary to decimal display', 'Multiplies signals', 'Amplifies voltage', 'Stores data'],
        correctAnswer: 0
      },
      {
        id: 'de14',
        question: 'How many flip-flops are needed for a 4-bit counter?',
        options: ['2', '4', '8', '16'],
        correctAnswer: 1
      },
      {
        id: 'de15',
        question: 'What is the octal equivalent of binary 111?',
        options: ['5', '6', '7', '8'],
        correctAnswer: 2
      },
      {
        id: 'de16',
        question: 'Which gate is a universal gate?',
        options: ['AND', 'OR', 'NAND', 'XOR'],
        correctAnswer: 2
      },
      {
        id: 'de17',
        question: 'What does PROM stand for?',
        options: ['Programmable Read-Only Memory', 'Permanent Read-Only Memory', 'Primary Read-Only Memory', 'Portable Read-Only Memory'],
        correctAnswer: 0
      },
      {
        id: 'de18',
        question: 'What is the duty cycle of a square wave?',
        options: ['25%', '50%', '75%', '100%'],
        correctAnswer: 1
      },
      {
        id: 'de19',
        question: 'Which register shifts data in one direction?',
        options: ['Parallel register', 'Shift register', 'Buffer register', 'Counter'],
        correctAnswer: 1
      },
      {
        id: 'de20',
        question: 'What is the maximum count of a 3-bit binary counter?',
        options: ['3', '6', '7', '8'],
        correctAnswer: 2
      },
      {
        id: 'de21',
        question: 'What is fan-out in digital circuits?',
        options: ['Cooling system', 'Number of gates that can be driven', 'Power consumption', 'Speed rating'],
        correctAnswer: 1
      },
      {
        id: 'de22',
        question: 'Which memory is volatile?',
        options: ['ROM', 'PROM', 'RAM', 'EPROM'],
        correctAnswer: 2
      },
      {
        id: 'de23',
        question: 'What is a race condition?',
        options: ['Speed competition', 'Timing problem in sequential circuits', 'High frequency operation', 'Circuit overload'],
        correctAnswer: 1
      },
      {
        id: 'de24',
        question: 'How many minterms are in a 3-variable Boolean function?',
        options: ['3', '6', '8', '9'],
        correctAnswer: 2
      },
      {
        id: 'de25',
        question: 'What is an encoder?',
        options: ['Converts decimal to binary', 'Stores data', 'Amplifies signal', 'Filters noise'],
        correctAnswer: 0
      },
      {
        id: 'de26',
        question: 'Which flip-flop has no invalid state?',
        options: ['SR', 'D', 'JK', 'T'],
        correctAnswer: 1
      },
      {
        id: 'de27',
        question: 'What is propagation delay?',
        options: ['Distance between gates', 'Time for signal to pass through gate', 'Power consumption time', 'Clock period'],
        correctAnswer: 1
      },
      {
        id: 'de28',
        question: 'Which code is used to prevent errors in digital transmission?',
        options: ['BCD', 'Gray code', 'ASCII', 'Hamming code'],
        correctAnswer: 3
      },
      {
        id: 'de29',
        question: 'What is a latch?',
        options: ['Logic gate', 'Level-triggered memory element', 'Clock generator', 'Voltage regulator'],
        correctAnswer: 1
      },
      {
        id: 'de30',
        question: 'How many selection lines are needed for an 8-to-1 multiplexer?',
        options: ['2', '3', '4', '8'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'electric-circuits',
    title: 'Electric Circuits',
    category: 'electrical',
    description: 'Basic electrical circuit theory, laws, and analysis',
    questions: [
      {
        id: 'ec1',
        question: 'What is Ohm\'s Law?',
        options: ['V = I/R', 'V = IR', 'V = I + R', 'V = I - R'],
        correctAnswer: 1
      },
      {
        id: 'ec2',
        question: 'What is the unit of resistance?',
        options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
        correctAnswer: 2
      },
      {
        id: 'ec3',
        question: 'In a series circuit, the total resistance is:',
        options: ['Sum of all resistances', 'Product of resistances', 'Average of resistances', 'Minimum resistance'],
        correctAnswer: 0
      },
      {
        id: 'ec4',
        question: 'What is Kirchhoff\'s Current Law?',
        options: ['Sum of voltages is zero', 'Sum of currents entering equals leaving', 'Power is conserved', 'Resistance is constant'],
        correctAnswer: 1
      },
      {
        id: 'ec5',
        question: 'What is the power formula?',
        options: ['P = V/I', 'P = VI', 'P = V + I', 'P = V - I'],
        correctAnswer: 1
      },
      {
        id: 'ec6',
        question: 'In a parallel circuit, voltage across each component is:',
        options: ['Different', 'Same', 'Zero', 'Undefined'],
        correctAnswer: 1
      },
      {
        id: 'ec7',
        question: 'What is the unit of capacitance?',
        options: ['Henry', 'Farad', 'Ohm', 'Volt'],
        correctAnswer: 1
      },
      {
        id: 'ec8',
        question: 'What does AC stand for?',
        options: ['Alternating Current', 'Active Current', 'Average Current', 'Automatic Current'],
        correctAnswer: 0
      },
      {
        id: 'ec9',
        question: 'What is the unit of inductance?',
        options: ['Farad', 'Henry', 'Ohm', 'Watt'],
        correctAnswer: 1
      },
      {
        id: 'ec10',
        question: 'What is the frequency of standard AC power in India?',
        options: ['50 Hz', '60 Hz', '100 Hz', '120 Hz'],
        correctAnswer: 0
      },
      {
        id: 'ec11',
        question: 'What is the relationship between voltage and current in a resistor?',
        options: ['Inversely proportional', 'Directly proportional', 'Exponentially related', 'No relationship'],
        correctAnswer: 1
      },
      {
        id: 'ec12',
        question: 'What is RMS voltage?',
        options: ['Maximum voltage', 'Root Mean Square voltage', 'Average voltage', 'Peak-to-peak voltage'],
        correctAnswer: 1
      },
      {
        id: 'ec13',
        question: 'What is the phase difference between voltage and current in a pure inductor?',
        options: ['0°', '45°', '90°', '180°'],
        correctAnswer: 2
      },
      {
        id: 'ec14',
        question: 'What is the impedance of an ideal inductor at DC?',
        options: ['Zero', 'Infinite', 'Unity', 'Depends on value'],
        correctAnswer: 0
      },
      {
        id: 'ec15',
        question: 'What is a node in a circuit?',
        options: ['Resistor', 'Point where components connect', 'Power source', 'Ground connection'],
        correctAnswer: 1
      },
      {
        id: 'ec16',
        question: 'What is the time constant of an RC circuit?',
        options: ['R/C', 'RC', 'R+C', 'R-C'],
        correctAnswer: 1
      },
      {
        id: 'ec17',
        question: 'What is superposition theorem used for?',
        options: ['Finding power', 'Analyzing circuits with multiple sources', 'Measuring voltage', 'Calculating resistance'],
        correctAnswer: 1
      },
      {
        id: 'ec18',
        question: 'What is the unit of energy?',
        options: ['Watt', 'Joule', 'Volt', 'Ampere'],
        correctAnswer: 1
      },
      {
        id: 'ec19',
        question: 'What is resonance in RLC circuit?',
        options: ['Maximum resistance', 'XL = XC', 'Minimum current', 'Zero voltage'],
        correctAnswer: 1
      },
      {
        id: 'ec20',
        question: 'What is the quality factor Q?',
        options: ['Resistance ratio', 'Selectivity measure', 'Power factor', 'Efficiency'],
        correctAnswer: 1
      },
      {
        id: 'ec21',
        question: 'What is Thevenin\'s theorem?',
        options: ['Simplifies circuit to voltage source and resistance', 'Calculates power', 'Measures current', 'Analyzes AC circuits'],
        correctAnswer: 0
      },
      {
        id: 'ec22',
        question: 'What is the power factor?',
        options: ['V/I', 'cos φ', 'P/V', 'I²R'],
        correctAnswer: 1
      },
      {
        id: 'ec23',
        question: 'What is a short circuit?',
        options: ['Zero resistance path', 'High resistance', 'Open circuit', 'Ideal source'],
        correctAnswer: 0
      },
      {
        id: 'ec24',
        question: 'What is Norton\'s theorem?',
        options: ['Voltage source equivalent', 'Current source equivalent', 'Power theorem', 'Resonance condition'],
        correctAnswer: 1
      },
      {
        id: 'ec25',
        question: 'What is the unit of charge?',
        options: ['Ampere', 'Coulomb', 'Volt', 'Ohm'],
        correctAnswer: 1
      },
      {
        id: 'ec26',
        question: 'What happens to capacitor at steady state DC?',
        options: ['Acts as short circuit', 'Acts as open circuit', 'Acts as resistor', 'Explodes'],
        correctAnswer: 1
      },
      {
        id: 'ec27',
        question: 'What is bandwidth in circuits?',
        options: ['Maximum voltage', 'Frequency range', 'Power range', 'Resistance range'],
        correctAnswer: 1
      },
      {
        id: 'ec28',
        question: 'What is the phase angle in RL circuit?',
        options: ['tan⁻¹(ωL/R)', 'tan⁻¹(R/ωL)', 'tan⁻¹(R/L)', 'tan⁻¹(L/R)'],
        correctAnswer: 0
      },
      {
        id: 'ec29',
        question: 'What is maximum power transfer theorem?',
        options: ['Load = Source resistance for max power', 'Maximum voltage transfer', 'Minimum loss', 'Resonance condition'],
        correctAnswer: 0
      },
      {
        id: 'ec30',
        question: 'What is the reactance of a capacitor?',
        options: ['ωC', '1/ωC', 'ωL', '1/ωL'],
        correctAnswer: 1
      }
    ]
  }
];
