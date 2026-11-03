require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const QuizAttempt = require('../models/QuizAttempt');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quizmaster';
    console.log(`[Seed] Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Quiz.deleteMany({}),
      Question.deleteMany({}),
      QuizAttempt.deleteMany({}),
    ]);

    console.log('[Seed] Creating Administrator and Student accounts...');
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', salt);
    const userPasswordHash = await bcrypt.hash('User@123456', salt);

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Platform Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@quizmaster.com').toLowerCase(),
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
    });

    const student1 = await User.create({
      name: 'Alex Johnson',
      email: 'user@quizmaster.com',
      passwordHash: userPasswordHash,
      role: 'user',
      status: 'active',
    });

    const student2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      passwordHash: userPasswordHash,
      role: 'user',
      status: 'active',
    });

    console.log('[Seed] Creating Categories...');
    const categoriesData = [
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Modern JavaScript, React, HTML5, CSS3, and full-stack fundamentals.',
        icon: 'Code',
      },
      {
        name: 'Database Systems',
        slug: 'database-systems',
        description: 'Relational SQL, MongoDB, indexing, ACID transactions, and query design.',
        icon: 'Database',
      },
      {
        name: 'Python Programming',
        slug: 'python-programming',
        description: 'Core syntax, OOP paradigms, comprehensions, and standard libraries.',
        icon: 'Terminal',
      },
      {
        name: 'Computer Networks',
        slug: 'computer-networks',
        description: 'TCP/IP stack, DNS, HTTP/HTTPS, routing, security, and protocols.',
        icon: 'Network',
      },
      {
        name: 'Data Structures & Algorithms',
        slug: 'data-structures-algorithms',
        description: 'Arrays, Trees, Graphs, Sorting, Dynamic Programming, and Big-O notation.',
        icon: 'Cpu',
      },
      {
        name: 'Cloud & DevOps',
        slug: 'cloud-devops',
        description: 'Containers, Docker, CI/CD pipelines, Kubernetes, and Cloud architectures.',
        icon: 'Cloud',
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    console.log('[Seed] Creating Quizzes and Questions...');

    // 1. Web Development Quiz
    const webDevQuiz = await Quiz.create({
      title: 'Full Stack Web Development & Modern JavaScript',
      description: 'Test your understanding of modern ES6+, DOM manipulation, asynchronous JavaScript, and React component lifecycles.',
      category: catMap['web-development'],
      difficulty: 'Medium',
      duration: 15,
      passingPercentage: 60,
      published: true,
      createdBy: admin._id,
    });

    const webDevQuestions = [
      {
        quiz: webDevQuiz._id,
        questionText: 'What is the primary difference between "let" and "var" declarations in JavaScript?',
        options: [
          '"let" is block-scoped, while "var" is function-scoped',
          '"var" is block-scoped, while "let" is function-scoped',
          '"let" cannot be reassigned once declared',
          'There is no functional difference between them',
        ],
        correctAnswer: 0,
        explanation: '"let" declarations are scoped to the nearest enclosing block statement {}, whereas "var" declarations are hoisted and scoped to the enclosing function.',
        difficulty: 'Easy',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'Which React Hook should be used to execute side effects like data fetching or DOM subscriptions?',
        options: ['useMemo', 'useState', 'useEffect', 'useCallback'],
        correctAnswer: 2,
        explanation: 'useEffect is specifically designed to perform side effects in functional React components after rendering.',
        difficulty: 'Easy',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'What does the JavaScript Event Loop handle?',
        options: [
          'Compiling JavaScript code into machine bytecode',
          'Executing asynchronous callbacks after the call stack clears',
          'Allocating memory on the garbage-collected heap',
          'Synchronizing CPU threads across multi-core processors',
        ],
        correctAnswer: 1,
        explanation: 'The Event Loop monitors the Call Stack and Task Queue, pushing queued asynchronous callbacks to the Call Stack when it becomes empty.',
        difficulty: 'Medium',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'In React, what purpose does the "key" prop serve when rendering dynamic lists?',
        options: [
          'It applies custom CSS styling to individual items',
          'It uniquely identifies DOM elements so React can efficiently reconcile differences',
          'It binds onClick handlers automatically to children',
          'It encrypts sensitive component data during transport',
        ],
        correctAnswer: 1,
        explanation: 'Keys give elements a stable identity across renders, enabling Reacts reconciliation algorithm to determine which items were added, modified, or removed.',
        difficulty: 'Medium',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'Which HTTP status code signifies that a requested resource was created successfully on the server?',
        options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
        correctAnswer: 1,
        explanation: 'HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource.',
        difficulty: 'Easy',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'What is CORS (Cross-Origin Resource Sharing)?',
        options: [
          'A frontend CSS framework for responsive layout design',
          'A browser security mechanism that restricts HTTP requests initiated from a different origin',
          'A database protocol for synchronizing distributed replicas',
          'An encryption standard for web socket streams',
        ],
        correctAnswer: 1,
        explanation: 'CORS is a browser security mechanism based on HTTP headers that permits or restricts web applications on one domain from requesting resources on another domain.',
        difficulty: 'Medium',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'What is the output of typeof null in standard JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correctAnswer: 2,
        explanation: 'Due to a historical bug in the initial JavaScript implementation that has been retained for backwards compatibility, typeof null evaluates to "object".',
        difficulty: 'Medium',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'Which method returns a new array with all elements that pass the test implemented by the provided function?',
        options: ['Array.prototype.forEach()', 'Array.prototype.map()', 'Array.prototype.filter()', 'Array.prototype.reduce()'],
        correctAnswer: 2,
        explanation: 'filter() creates a shallow copy of a portion of a given array, filtered down to just the elements from the given array that pass the test.',
        difficulty: 'Easy',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'What is the Virtual DOM in React?',
        options: [
          'A direct copy of the browser DOM stored on a Node.js server',
          'An in-memory lightweight representation of the real DOM used to compute minimal updates',
          'A hardware accelerator for CSS transform animations',
          'A shadow DOM encapsulation for Web Components',
        ],
        correctAnswer: 1,
        explanation: 'The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses it to diff changes and batch minimal updates to the real DOM.',
        difficulty: 'Medium',
      },
      {
        quiz: webDevQuiz._id,
        questionText: 'What is the purpose of JWT (JSON Web Token) in modern web applications?',
        options: [
          'To format database query results into XML',
          'To securely transmit claims between parties as a compact, self-contained JSON object for authentication',
          'To compress video files for faster streaming over HTTP/2',
          'To automatically compile TypeScript into JavaScript',
        ],
        correctAnswer: 1,
        explanation: 'JWTs are compact, URL-safe tokens used for stateless authentication and secure information exchange, signed cryptographically using HMAC or RSA.',
        difficulty: 'Medium',
      },
    ];

    // 2. Database Systems Quiz
    const dbQuiz = await Quiz.create({
      title: 'MongoDB & Database Systems Mastery',
      description: 'Master NoSQL document modeling, indexing strategies, aggregation pipelines, and ACID transactions.',
      category: catMap['database-systems'],
      difficulty: 'Medium',
      duration: 15,
      passingPercentage: 60,
      published: true,
      createdBy: admin._id,
    });

    const dbQuestions = [
      {
        quiz: dbQuiz._id,
        questionText: 'In MongoDB, what is the equivalent of a table in a relational database?',
        options: ['Document', 'Collection', 'Schema', 'Field'],
        correctAnswer: 1,
        explanation: 'A collection in MongoDB is a grouping of MongoDB documents, analogous to a table in a relational database management system.',
        difficulty: 'Easy',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'Which MongoDB aggregation stage is used to filter documents similar to the find() query condition?',
        options: ['$group', '$project', '$match', '$sort'],
        correctAnswer: 2,
        explanation: 'The $match stage filters documents to pass only the documents that match the specified condition(s) to the next pipeline stage.',
        difficulty: 'Medium',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'What type of index in MongoDB ensures that duplicate values cannot be inserted for the indexed field?',
        options: ['Compound Index', 'Unique Index', 'Sparse Index', 'TTL Index'],
        correctAnswer: 1,
        explanation: 'A Unique Index ensures that the indexed fields do not store duplicate values; i.e. enforces uniqueness for the indexed fields.',
        difficulty: 'Easy',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'What does the "A" in ACID database properties stand for?',
        options: ['Asynchronous', 'Atomicity', 'Availability', 'Authentication'],
        correctAnswer: 1,
        explanation: 'Atomicity ensures that all operations within a work unit are completed successfully; otherwise, the transaction is aborted and rolled back.',
        difficulty: 'Easy',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'What is the default primary key field automatically generated by MongoDB for each document?',
        options: ['id', '_id', 'uuid', 'document_id'],
        correctAnswer: 1,
        explanation: 'MongoDB automatically reserves the _id field as the primary key for every document and indexes it uniquely by default.',
        difficulty: 'Easy',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'In Mongoose, what is the role of the populate() method?',
        options: [
          'To generate random dummy documents for unit testing',
          'To automatically replace specified paths in a document with documents from other collections via references',
          'To compress the BSON data stored in memory',
          'To validate schema types before saving',
        ],
        correctAnswer: 1,
        explanation: 'populate() lets you reference documents in other collections by ObjectId and automatically fetch and embed them when querying.',
        difficulty: 'Medium',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'What is the BSON format used by MongoDB?',
        options: [
          'Binary JSON, a binary-encoded serialization of JSON-like documents',
          'Browser Standard Object Notation',
          'Basic String Object Network',
          'Buffered Sequential Object Node',
        ],
        correctAnswer: 0,
        explanation: 'BSON stands for Binary JSON. It provides additional data types (such as Date and raw binary data) and faster traversal than plaintext JSON.',
        difficulty: 'Medium',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'Which operator is used in MongoDB to add an item to an array without allowing duplicates?',
        options: ['$push', '$addToSet', '$append', '$insert'],
        correctAnswer: 1,
        explanation: 'The $addToSet operator adds a value to an array unless the value is already present, in which case it does nothing.',
        difficulty: 'Medium',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'What is the CAP Theorem trade-off principle in distributed database systems?',
        options: [
          'Cost, Accuracy, and Performance',
          'Consistency, Availability, and Partition Tolerance',
          'Concurrency, Atomicity, and Persistence',
          'Capacity, Allocation, and Parallelism',
        ],
        correctAnswer: 1,
        explanation: 'The CAP theorem states that a distributed data store can only simultaneously guarantee at most two out of: Consistency, Availability, and Partition tolerance.',
        difficulty: 'Hard',
      },
      {
        quiz: dbQuiz._id,
        questionText: 'What does sharding achieve in MongoDB?',
        options: [
          'Creating read-only backup copies of data across regions',
          'Distributing data across multiple physical machines to support very large datasets and high throughput',
          'Converting relational SQL tables into document schemas',
          'Encrypting documents at rest with hardware keys',
        ],
        correctAnswer: 1,
        explanation: 'Sharding is MongoDBs method for horizontal scaling, partitioning large collections across clusters of database instances.',
        difficulty: 'Hard',
      },
    ];

    // 3. Python Programming Quiz
    const pythonQuiz = await Quiz.create({
      title: 'Python Fundamentals & OOP Essentials',
      description: 'Assess your skills in core Python concepts, data types, list comprehensions, decorators, and object-oriented programming.',
      category: catMap['python-programming'],
      difficulty: 'Easy',
      duration: 12,
      passingPercentage: 70,
      published: true,
      createdBy: admin._id,
    });

    const pythonQuestions = [
      {
        quiz: pythonQuiz._id,
        questionText: 'Which of the following data structures in Python is immutable?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctAnswer: 3,
        explanation: 'Tuples are immutable sequences in Python; once initialized, their elements cannot be modified, appended, or removed.',
        difficulty: 'Easy',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What is the output of bool([]) in Python?',
        options: ['True', 'False', 'None', 'TypeError'],
        correctAnswer: 1,
        explanation: 'In Python, empty collections (empty list, empty tuple, empty string, empty dict) evaluate to False in boolean context.',
        difficulty: 'Easy',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'Which keyword is used to define a function in Python?',
        options: ['function', 'func', 'def', 'lambda'],
        correctAnswer: 2,
        explanation: 'The def keyword begins a function definition in Python.',
        difficulty: 'Easy',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What does the __init__ method do in a Python class?',
        options: [
          'It is the destructor called when an object is garbage collected',
          'It acts as the constructor method that initializes newly created class instances',
          'It imports required modules for the class',
          'It compiles the class into byte-code',
        ],
        correctAnswer: 1,
        explanation: '__init__ is the initializer method automatically invoked when a new instance of a class is created.',
        difficulty: 'Easy',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What is the correct syntax for a list comprehension generating squares of even numbers from 0 to 9?',
        options: [
          '[x**2 for x in range(10) if x % 2 == 0]',
          '[for x in range(10) x**2 if x % 2 == 0]',
          '[x**2 if x % 2 == 0 for x in range(10)]',
          '{x: x**2 for x in range(10) if x % 2 == 0}',
        ],
        correctAnswer: 0,
        explanation: 'The standard list comprehension syntax with a filter clause is [expression for item in iterable if condition].',
        difficulty: 'Medium',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What is a decorator in Python?',
        options: [
          'A GUI widget that decorates desktop applications',
          'A function that takes another function as an argument and extends its behavior without modifying it',
          'A syntax error highlighter in IDEs',
          'A built-in data type for string formatting',
        ],
        correctAnswer: 1,
        explanation: 'A decorator is a callable that takes a function as input and returns a wrapped function, augmenting its behavior.',
        difficulty: 'Medium',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What does the "self" parameter represent inside a Python class method?',
        options: [
          'A global reference to the Python interpreter',
          'The current instance of the class',
          'The parent class in single inheritance',
          'A pointer to the classes memory address',
        ],
        correctAnswer: 1,
        explanation: 'By convention, self refers to the instance of the class through which the method was called.',
        difficulty: 'Easy',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'Which built-in module provides tools for working with dates and times in Python?',
        options: ['timeutil', 'datetime', 'clock', 'calendar_time'],
        correctAnswer: 1,
        explanation: 'The datetime module supplies classes for manipulating dates and times in both simple and complex ways.',
        difficulty: 'Easy',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What is the GIL (Global Interpreter Lock) in CPython?',
        options: [
          'A mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously',
          'A security firewall for Python network sockets',
          'A tool to lock installed package versions in requirements.txt',
          'A mechanism for encrypting Python source files',
        ],
        correctAnswer: 0,
        explanation: 'The GIL is a mutex used by CPython to ensure that only one thread executes Python bytecode at a time, protecting memory management.',
        difficulty: 'Hard',
      },
      {
        quiz: pythonQuiz._id,
        questionText: 'What does the "pass" statement do in Python?',
        options: [
          'Terminates the program immediately',
          'Acts as a null operation; nothing happens when it executes',
          'Skips to the next iteration of a loop',
          'Returns True from a function',
        ],
        correctAnswer: 1,
        explanation: 'pass is a null statement used as a syntactic placeholder when a statement is required syntactically but no code needs to run.',
        difficulty: 'Easy',
      },
    ];

    // 4. Computer Networks Quiz
    const netQuiz = await Quiz.create({
      title: 'Computer Networking & Protocols',
      description: 'Explore network layers, IP addressing, TCP handshakes, DNS resolution, and secure communications.',
      category: catMap['computer-networks'],
      difficulty: 'Hard',
      duration: 15,
      passingPercentage: 60,
      published: true,
      createdBy: admin._id,
    });

    const netQuestions = [
      {
        quiz: netQuiz._id,
        questionText: 'How many layers are defined in the OSI (Open Systems Interconnection) reference model?',
        options: ['4', '5', '7', '8'],
        correctAnswer: 2,
        explanation: 'The OSI model defines 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.',
        difficulty: 'Easy',
      },
      {
        quiz: netQuiz._id,
        questionText: 'What are the steps of the TCP Three-Way Handshake used to establish a reliable connection?',
        options: [
          'SYN, SYN-ACK, ACK',
          'PING, PONG, ACK',
          'HELLO, ACCEPT, CONNECT',
          'INIT, VERIFY, START',
        ],
        correctAnswer: 0,
        explanation: 'TCP connection establishment uses a three-way handshake: the client sends a SYN packet, the server responds with SYN-ACK, and the client acknowledges with ACK.',
        difficulty: 'Medium',
      },
      {
        quiz: netQuiz._id,
        questionText: 'Which protocol is responsible for translating human-readable domain names (e.g., example.com) into IP addresses?',
        options: ['DHCP', 'ARP', 'DNS', 'ICMP'],
        correctAnswer: 2,
        explanation: 'DNS (Domain Name System) resolves human-friendly hostnames into machine-routable IP addresses.',
        difficulty: 'Easy',
      },
      {
        quiz: netQuiz._id,
        questionText: 'What is the primary difference between TCP and UDP at the Transport layer?',
        options: [
          'TCP is connection-oriented and reliable, while UDP is connectionless and does not guarantee packet delivery',
          'UDP is connection-oriented and encrypted, while TCP is plaintext',
          'TCP can only be used on local area networks (LANs)',
          'UDP packets cannot exceed 64 bytes in size',
        ],
        correctAnswer: 0,
        explanation: 'TCP provides reliable, ordered, error-checked delivery of byte streams, while UDP provides minimal connectionless datagram delivery with lower latency.',
        difficulty: 'Medium',
      },
      {
        quiz: netQuiz._id,
        questionText: 'What is the default TCP port number used for HTTPS (HTTP over TLS/SSL)?',
        options: ['80', '8080', '443', '22'],
        correctAnswer: 2,
        explanation: 'Port 443 is the standard port for HTTPS traffic, whereas standard unencrypted HTTP uses port 80.',
        difficulty: 'Easy',
      },
      {
        quiz: netQuiz._id,
        questionText: 'Which protocol resolves an IPv4 network address into a physical MAC address on a local area network?',
        options: ['NAT', 'ARP', 'BGP', 'RARP'],
        correctAnswer: 1,
        explanation: 'ARP (Address Resolution Protocol) maps dynamic IP addresses to permanent physical media access control (MAC) addresses.',
        difficulty: 'Medium',
      },
      {
        quiz: netQuiz._id,
        questionText: 'In IPv4 networking, what is the default subnet mask for a standard Class C network?',
        options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
        correctAnswer: 2,
        explanation: 'Class C networks use the /24 subnet mask, which translates to 255.255.255.0 in dotted-decimal format.',
        difficulty: 'Medium',
      },
      {
        quiz: netQuiz._id,
        questionText: 'What is the purpose of NAT (Network Address Translation)?',
        options: [
          'It maps multiple private IP addresses inside a local network to a single public IP address on the internet',
          'It accelerates DNS lookups via distributed caching',
          'It compresses binary data during TCP transmission',
          'It generates digital certificates for web servers',
        ],
        correctAnswer: 0,
        explanation: 'NAT allows a router to modify network address information in IP headers, mapping an entire private IP subnet to one public IP address.',
        difficulty: 'Medium',
      },
      {
        quiz: netQuiz._id,
        questionText: 'Which routing protocol is known as the "protocol that makes the Internet work" by exchanging routing info between Autonomous Systems?',
        options: ['OSPF', 'RIP', 'BGP', 'EIGRP'],
        correctAnswer: 2,
        explanation: 'BGP (Border Gateway Protocol) is the standardized exterior gateway protocol designed to exchange routing and reachability information among Autonomous Systems.',
        difficulty: 'Hard',
      },
      {
        quiz: netQuiz._id,
        questionText: 'What security attack involves intercepting and potentially altering communication between two parties without their knowledge?',
        options: [
          'Distributed Denial of Service (DDoS)',
          'Man-in-the-Middle (MitM)',
          'SQL Injection',
          'Cross-Site Scripting (XSS)',
        ],
        correctAnswer: 1,
        explanation: 'In a Man-in-the-Middle (MitM) attack, the attacker secretly relays and possibly alters the communication between two parties who believe they are directly communicating.',
        difficulty: 'Medium',
      },
    ];

    // 5. Data Structures & Algorithms Quiz
    const dsaQuiz = await Quiz.create({
      title: 'Data Structures & Algorithmic Thinking',
      description: 'Challenge your understanding of algorithm complexities, sorting, binary trees, graphs, and dynamic programming.',
      category: catMap['data-structures-algorithms'],
      difficulty: 'Hard',
      duration: 20,
      passingPercentage: 60,
      published: true,
      createdBy: admin._id,
    });

    const dsaQuestions = [
      {
        quiz: dsaQuiz._id,
        questionText: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
        explanation: 'In a balanced BST, each comparison cuts the remaining search space in half, yielding O(log n) time complexity.',
        difficulty: 'Medium',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'Which sorting algorithm has a guaranteed worst-case time complexity of O(n log n)?',
        options: ['Quicksort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'],
        correctAnswer: 1,
        explanation: 'Merge Sort consistently divides the array into halves and merges them, maintaining O(n log n) complexity across best, average, and worst cases.',
        difficulty: 'Medium',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'Which data structure follows the LIFO (Last In, First Out) principle?',
        options: ['Queue', 'Stack', 'Linked List', 'Priority Queue'],
        correctAnswer: 1,
        explanation: 'A Stack is a LIFO structure where the most recently inserted element is the first one removed.',
        difficulty: 'Easy',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'What is the worst-case time complexity of QuickSelect when choosing the k-th smallest element with poor pivot selection?',
        options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(n log n)'],
        correctAnswer: 2,
        explanation: 'If the chosen pivot is consistently the maximum or minimum element, QuickSelect degrades to O(n^2) worst-case time.',
        difficulty: 'Hard',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'Which graph traversal algorithm uses a FIFO Queue to visit vertices level by level?',
        options: [
          'Breadth-First Search (BFS)',
          'Depth-First Search (DFS)',
          'Dijkstras Algorithm',
          'Floyd-Warshall Algorithm',
        ],
        correctAnswer: 0,
        explanation: 'Breadth-First Search (BFS) utilizes a Queue to explore all neighbor nodes at the present depth level before moving on to nodes at the next depth level.',
        difficulty: 'Medium',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'What data structure is used internally by standard implementations of Hash Tables to resolve collisions via separate chaining?',
        options: ['Array or Linked List', 'Binary Heap', 'Red-Black Tree', 'Circular Buffer'],
        correctAnswer: 0,
        explanation: 'Separate chaining stores colliding elements in a linked list (or dynamic array) associated with each hash bucket.',
        difficulty: 'Medium',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'What is the space complexity of a recursive Fibonacci function without memoization: fib(n) = fib(n-1) + fib(n-2)?',
        options: ['O(1)', 'O(n)', 'O(2^n)', 'O(log n)'],
        correctAnswer: 1,
        explanation: 'The call stack grows proportionally to the maximum depth of the recursion tree, which is n, resulting in O(n) space complexity.',
        difficulty: 'Hard',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'In a Min-Heap, where is the smallest element located?',
        options: ['At any leaf node', 'At the root node', 'At the rightmost bottom node', 'At index n/2'],
        correctAnswer: 1,
        explanation: 'In a Min-Heap, the min-heap property ensures that the key at any node is less than or equal to the keys of its children; hence the root holds the minimum element.',
        difficulty: 'Easy',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'Which algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights?',
        options: ['Kruskals Algorithm', 'Dijkstras Algorithm', 'Prims Algorithm', 'Topological Sort'],
        correctAnswer: 1,
        explanation: 'Dijkstras algorithm solves the single-source shortest path problem for graphs with non-negative edge weights using a priority queue.',
        difficulty: 'Medium',
      },
      {
        quiz: dsaQuiz._id,
        questionText: 'What is Dynamic Programming based on?',
        options: [
          'Randomized trial-and-error iterations',
          'Breaking problems into overlapping subproblems and storing subproblem results (optimal substructure and memoization)',
          'Brute force exhaustive search through binary trees',
          'Iterative greedy local optimum decisions',
        ],
        correctAnswer: 1,
        explanation: 'Dynamic Programming solves complex problems by breaking them into overlapping subproblems and caching their solutions to avoid redundant computations.',
        difficulty: 'Medium',
      },
    ];

    // 6. Cloud & DevOps Quiz
    const cloudQuiz = await Quiz.create({
      title: 'Cloud Computing, Containers & DevOps',
      description: 'Evaluate your knowledge of Docker containers, CI/CD pipelines, Kubernetes primitives, and cloud architecture patterns.',
      category: catMap['cloud-devops'],
      difficulty: 'Medium',
      duration: 15,
      passingPercentage: 60,
      published: true,
      createdBy: admin._id,
    });

    const cloudQuestions = [
      {
        quiz: cloudQuiz._id,
        questionText: 'What is the fundamental difference between a Docker container and a traditional Virtual Machine (VM)?',
        options: [
          'Containers share the host OS kernel and are lightweight, while VMs run full guest operating systems on a hypervisor',
          'VMs cannot run Linux distributions',
          'Containers require hardware virtualization support (VT-x)',
          'VMs start up in milliseconds, while containers take minutes',
        ],
        correctAnswer: 0,
        explanation: 'Containers virtualize at the operating system level, sharing the host kernel with isolated user spaces, making them much faster and lighter than full hypervisor-managed VMs.',
        difficulty: 'Medium',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'In Kubernetes, what is the smallest and simplest deployable unit that can be created and managed?',
        options: ['Deployment', 'Pod', 'Service', 'Namespace'],
        correctAnswer: 1,
        explanation: 'A Pod is the basic building block of Kubernetes, representing one or more containers sharing storage and network resources.',
        difficulty: 'Easy',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'Which command is used to build a Docker image from a Dockerfile in the current directory?',
        options: ['docker run -b .', 'docker build -t my-image .', 'docker image create .', 'docker make .'],
        correctAnswer: 1,
        explanation: 'docker build -t <tag_name> . reads instructions from the Dockerfile in the current path and compiles the container image.',
        difficulty: 'Easy',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'What does CI/CD stand for in modern software engineering?',
        options: [
          'Continuous Integration and Continuous Delivery / Deployment',
          'Code Inspection and Constant Debugging',
          'Cloud Infrastructure and Centralized Data',
          'Container Initialization and Cluster Deployment',
        ],
        correctAnswer: 0,
        explanation: 'CI/CD stands for Continuous Integration (merging and automating tests on code changes) and Continuous Delivery/Deployment (automating release to production).',
        difficulty: 'Easy',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'Which cloud service model provides consumers with complete hardware infrastructure (virtual machines, storage, networks) on demand?',
        options: ['SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'IaaS (Infrastructure as a Service)', 'FaaS (Function as a Service)'],
        correctAnswer: 2,
        explanation: 'IaaS provides fundamental compute, network, and storage resources on which users can install and run arbitrary operating systems and applications (e.g. AWS EC2).',
        difficulty: 'Easy',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'What is Infrastructure as Code (IaC)?',
        options: [
          'Writing source code inside cloud web consoles',
          'Managing and provisioning computing infrastructure through machine-readable definition files rather than physical hardware configuration',
          'Compiling backend code directly into FPGA hardware',
          'A database backup script',
        ],
        correctAnswer: 1,
        explanation: 'IaC involves managing IT infrastructure using descriptive configuration files (such as Terraform or Ansible), version-controlled alongside application code.',
        difficulty: 'Medium',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'In Docker, what is the purpose of a multi-stage build?',
        options: [
          'To run multiple containers on different cloud providers simultaneously',
          'To separate build-time dependencies from the final lightweight production image, minimizing image size and attack surface',
          'To compile code in multiple programming languages simultaneously',
          'To execute unit tests before committing to Git',
        ],
        correctAnswer: 1,
        explanation: 'Multi-stage builds allow you to use intermediate images to compile or bundle code, copying only the final build artifacts into the minimal runtime image.',
        difficulty: 'Medium',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'What is a reverse proxy such as Nginx commonly used for in cloud deployments?',
        options: [
          'Load balancing, SSL/TLS termination, and caching incoming client requests',
          'Generating automated unit test coverage reports',
          'Replacing database primary keys with UUIDs',
          'Encrypting hard drives on local developer laptops',
        ],
        correctAnswer: 0,
        explanation: 'Reverse proxies sit in front of backend servers, handling load distribution, SSL certificates, compression, and request routing.',
        difficulty: 'Medium',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'In Kubernetes, which resource provides a single stable IP address and DNS name to route traffic to a dynamic set of Pods?',
        options: ['ConfigMap', 'Service', 'Ingress Controller', 'ReplicaSet'],
        correctAnswer: 1,
        explanation: 'A Kubernetes Service is an abstraction that defines a logical set of Pods and a policy by which to access them via a stable internal IP and port.',
        difficulty: 'Medium',
      },
      {
        quiz: cloudQuiz._id,
        questionText: 'What is the 12-Factor App methodology principle regarding application configuration?',
        options: [
          'Hardcode configurations in constants files for fast runtime lookup',
          'Store config in environment variables',
          'Store configuration in encrypted XML files inside git repositories',
          'Fetch configuration dynamically from client HTTP headers',
        ],
        correctAnswer: 1,
        explanation: 'Factor III of The Twelve-Factor App specifies that application configuration should strictly be stored in environment variables, separating code from deploy-specific config.',
        difficulty: 'Medium',
      },
    ];

    // Insert all questions into DB
    const allQuestions = [
      ...webDevQuestions,
      ...dbQuestions,
      ...pythonQuestions,
      ...netQuestions,
      ...dsaQuestions,
      ...cloudQuestions,
    ];

    console.log(`[Seed] Inserting ${allQuestions.length} questions into MongoDB...`);
    await Question.insertMany(allQuestions);

    console.log('[Seed] Generating sample completed attempts for demonstration...');
    // Create initial attempts for Sarah Chen and Alex Johnson so charts and admin tables show real data!
    const sarahAttempt1 = await QuizAttempt.create({
      user: student2._id,
      quiz: webDevQuiz._id,
      startedAt: new Date(Date.now() - 3600 * 1000 * 2), // 2 hours ago
      submittedAt: new Date(Date.now() - 3600 * 1000 * 2 + 540 * 1000), // 9 minutes later
      status: 'Completed',
      score: 9,
      totalMarks: 10,
      correctCount: 9,
      incorrectCount: 1,
      unansweredCount: 0,
      percentage: 90,
      timeTaken: 540,
      passed: true,
      snapshot: webDevQuestions.map((q, idx) => ({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedOption: idx === 6 ? 1 : q.correctAnswer, // missed question 7
        isCorrect: idx !== 6,
      })),
    });

    const sarahAttempt2 = await QuizAttempt.create({
      user: student2._id,
      quiz: pythonQuiz._id,
      startedAt: new Date(Date.now() - 3600 * 1000 * 24), // 1 day ago
      submittedAt: new Date(Date.now() - 3600 * 1000 * 24 + 420 * 1000),
      status: 'Completed',
      score: 8,
      totalMarks: 10,
      correctCount: 8,
      incorrectCount: 2,
      unansweredCount: 0,
      percentage: 80,
      timeTaken: 420,
      passed: true,
      snapshot: pythonQuestions.map((q, idx) => ({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedOption: idx > 7 ? 0 : q.correctAnswer,
        isCorrect: idx <= 7,
      })),
    });

    const alexAttempt1 = await QuizAttempt.create({
      user: student1._id,
      quiz: dbQuiz._id,
      startedAt: new Date(Date.now() - 3600 * 1000 * 5), // 5 hours ago
      submittedAt: new Date(Date.now() - 3600 * 1000 * 5 + 610 * 1000),
      status: 'Completed',
      score: 7,
      totalMarks: 10,
      correctCount: 7,
      incorrectCount: 3,
      unansweredCount: 0,
      percentage: 70,
      timeTaken: 610,
      passed: true,
      snapshot: dbQuestions.map((q, idx) => ({
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        selectedOption: idx >= 7 ? 3 : q.correctAnswer,
        isCorrect: idx < 7,
      })),
    });

    console.log('[Seed] Database seeding completed successfully!');
    console.log('--------------------------------------------------');
    console.log('Categories created: 6');
    console.log('Quizzes created:    6');
    console.log('Questions created:  60 (10 per quiz)');
    console.log('Sample attempts:    3 completed attempts');
    console.log('Admin Account:      admin@quizmaster.com / Admin@123456');
    console.log('Student Account 1:  user@quizmaster.com / User@123456');
    console.log('Student Account 2:  sarah.chen@example.com / User@123456');
    console.log('--------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
