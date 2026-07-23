const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const classes = [
  { number: 6, name: "Class 6" },
  { number: 7, name: "Class 7" },
  { number: 8, name: "Class 8" },
  { number: 9, name: "Class 9" },
  { number: 10, name: "Class 10" },
  { number: 11, name: "Class 11" },
  { number: 12, name: "Class 12" },

];

const HIDDEN_SUBJECTS = new Set([
  "Urdu", "Sanskrit", "Skill Education", "Vocational", "Vocational Education",
  "Physical Education and Well Being", "Health and Physical Education", "Arts",
  "Kannada", "Malayalam", "Marathi", "Nepali", "Punjabi", "Santhali", "Tamil",
  "Fine Art", "Sangeet", "Heritage Crafts", "Creative Writing and Translation",
  "Creative Writing & Translation", "Graphics design", "New Age Graphics Design",
  "Computers and Communication Technology", "Knowledge Traditions Practices of India",
]);

// Keep ALL subjects (visible + hidden) so the DB has a complete record.
// Hidden subjects are marked with hidden:true but are not deleted.
const subjectsByClass = {
  6: ["Arts", "English", "Hindi", "Kannada", "Malayalam", "Marathi", "Mathematics", "Nepali", "Physical Education and Well Being", "Punjabi", "Sanskrit", "Santhali", "Science", "Social Science", "Tamil", "Urdu", "Vocational Education"],
  7: ["Arts", "English", "Hindi", "Mathematics", "Physical Education and Well Being", "Sanskrit", "Science", "Social Science", "Urdu", "Vocational Education"],
  8: ["Arts", "English", "Hindi", "Mathematics", "Physical Education and Well Being", "Sanskrit", "Science", "Social Science", "Urdu", "Vocational Education"],
  9: ["Arts", "English", "Hindi", "Mathematics", "Physical Education and Well Being", "Sanskrit", "Science", "Skill Education", "Social Science", "Urdu", "Vocational"],
  10: ["English", "Health and Physical Education", "Hindi", "Mathematics", "Sanskrit", "Science", "Social Science", "Urdu"],
  11: ["Accountancy", "Biology", "Biotechnology", "Business Studies", "Chemistry", "Computer Science", "Computers and Communication Technology", "Creative Writing and Translation", "Economics", "English", "Fine Art", "Geography", "Graphics design", "Health and Physical Education", "Heritage Crafts", "Hindi", "History", "Home Science", "Informatics Practices", "Knowledge Traditions Practices of India", "Mathematics", "Physics", "Political Science", "Psychology", "Sangeet", "Sanskrit", "Sociology", "Urdu", "Vocational"],
  12: ["Accountancy", "Biology", "Biotechnology", "Business Studies", "Chemistry", "Computer Science", "Creative Writing & Translation", "Economics", "English", "Fine Art", "Geography", "Heritage Crafts", "Hindi", "History", "Home Science", "Informatics Practices", "Mathematics", "New Age Graphics Design", "Physics", "Political Science", "Psychology", "Sangeet", "Sanskrit", "Sociology", "Urdu"],

};

const chapters = {
  "10-English": ["A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Stories about Flying", "From the Diary of Anne Frank", "The Hundred Dresses - I", "The Hundred Dresses - II", "Glimpses of India", "Mijbil the Otter", "Madam Rides the Bus", "The Sermon at Benares", "The Proposal", "A Triumph of Surgery", "The Thief's Story", "The Midnight Visitor", "A Question of Trust", "Footprints without Feet", "The Making of a Scientist", "The Necklace", "The Hack Driver", "Bholi"],
  "10-Health and Physical Education": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13"],
  "10-Hindi": ["Kshitij - Bhag 2", "Kritika - Bhag 2", "Sanchayan - Bhag 2"],
  "10-Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
  "10-Sanskrit": ["Shemushi - Bhag 2", "Abhyasvan Bhav"],
  "10-Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity", "Light – Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment", "Sustainable Management of Natural Resources"],
  "10-Social Science": ["The Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Print Culture and the Modern World", "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy", "Power Sharing", "Federalism", "Democracy and Diversity", "Gender, Religion and Caste", "Political Parties", "Outcomes of Democracy", "Challenges to Democracy", "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Consumer Rights"],
  "10-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12"],
  "11-Accountancy": ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Transactions - I", "Recording of Transactions - II", "Bank Reconciliation Statement", "Trial Balance and Rectification of Errors", "Depreciation, Provisions and Reserves", "Bill of Exchange", "Financial Statements - I", "Financial Statements - II", "Accounts from Incomplete Records", "Applications of Computers in Accounting"],
  "11-Biology": ["The Living World", "Biological Classification", "Plant Kingdom", "Animal Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Structural Organization in Animals", "Cell: The Unit of Life", "Biomolecules", "Cell Cycle and Cell Division", "Transport in Plants", "Mineral Nutrition", "Photosynthesis in Higher Plants", "Respiration in Plants", "Plant Growth and Development", "Digestion and Absorption", "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products and Elimination", "Locomotion and Movement", "Neural Control and Coordination", "Chemical Coordination and Integration"],
  "11-Biotechnology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12"],
  "11-Business Studies": ["Business, Trade and Commerce", "Forms of Business Organisation", "Private, Public and Global Enterprises", "Business Services", "Emerging Modes of Business", "Social Responsibilities of Business", "Formation of a Company", "Sources of Business Finance", "Small Business and Entrepreneurship", "Internal Trade", "International Business"],
  "11-Chemistry": ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity", "Chemical Bonding and Molecular Structure", "Chemical Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry - Some Basic Principles", "Hydrocarbons", "The s-Block Elements", "The p-Block Elements", "Environmental Chemistry"],
  "11-Computer Science": ["Computer System", "Encoding Schemes and Number System", "Emerging Trends", "Introduction to Problem Solving", "Getting Started with Python", "Flow of Control", "Functions", "Strings", "Lists", "Tuples and Dictionaries", "Societal Impact"],
  "11-Computers and Communication Technology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Creative Writing and Translation": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
  "11-Economics": ["Indian Economy on the Eve of Independence", "Indian Economy 1950-1990", "Economic Reforms Since 1991", "Poverty", "Human Capital Formation in India", "Rural Development", "Employment: Growth, Informalisation", "Infrastructure", "Environment and Sustainable Development", "Comparative Development Experiences", "Introduction to Microeconomics", "Theory of Consumer Behaviour", "Production and Costs", "The Theory of the Firm", "Market Equilibrium", "Non-Competitive Markets"],
  "11-English": ["The Portrait of a Lady", "We're Not Afraid to Die...", "Discovering Tut: The Saga Continues", "Landscape of the Soul", "The Ailing Planet", "The Browning Version", "The Adventure", "Silk Road", "The Summer of the Beautiful White Horse", "The Address", "Ranga's Marriage", "Albert Einstein at School", "Mother's Day", "Birth", "The Tale of Melon City"],
  "11-Fine Art": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Geography": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14"],
  "11-Graphics design": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Health and Physical Education": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11"],
  "11-Heritage Crafts": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"],
  "11-Hindi": ["Antra - Bhag 1", "Aroh - Bhag 1", "Vitan - Bhag 1"],
  "11-History": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "11-Home Science": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "11-Informatics Practices": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Knowledge Traditions Practices of India": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9"],
  "11-Mathematics": ["Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Statistics", "Probability"],
  "11-Physics": ["Physical World", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy and Power", "System of Particles and Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"],
  "11-Political Science": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Psychology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Sangeet": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "11-Sanskrit": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11"],
  "11-Sociology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
  "11-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17", "Chapter 18", "Chapter 19", "Chapter 20"],
  "11-Vocational": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
  "12-Accountancy": ["Financial Statements of Not-for-Profit Organisations", "Accounting for Partnership Firms - Fundamentals", "Goodwill: Nature and Valuation", "Change in Profit-Sharing Ratio", "Admission of a Partner", "Retirement/Death of a Partner", "Dissolution of a Partnership Firm", "Accounting for Share Capital", "Issue of Debentures", "Redemption of Debentures", "Financial Statements of a Company", "Analysis of Financial Statements", "Cash Flow Statement"],
  "12-Biology": ["Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production", "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation", "Environmental Issues"],
  "12-Biotechnology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13"],
  "12-Business Studies": ["Nature and Significance of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Financial Markets", "Marketing Management", "Consumer Protection"],
  "12-Chemistry": ["The Solid State", "Solutions", "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "General Principles and Processes of Isolation", "The p-Block Elements", "The d- and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules", "Polymers", "Chemistry in Everyday Life"],
  "12-Computer Science": ["Exceptional Handling in Python", "File Handling in Python", "Data Structure - Stack", "Queue", "Recursion", "Searching", "Sorting", "Database Concepts", "SQL", "Computer Networks", "Data Communication", "Security Aspects"],
  "12-Creative Writing & Translation": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
  "12-Economics": ["Introduction to Macroeconomics", "National Income Accounting", "Money and Banking", "Aggregate Demand and Related Concepts", "Income Determination", "Excess Demand and Deficient Demand", "Government Budget and the Economy", "Foreign Exchange Rate", "Balance of Payments", "Introduction to Indian Economy", "Indian Economy 1950-1990", "Economic Reforms Since 1991", "Poverty", "Human Capital Formation", "Rural Development", "Employment", "Infrastructure", "Environment and Sustainable Development"],
  "12-English": ["The Last Lesson", "Lost Spring", "Deep Water", "The Rattrap", "Indigo", "Going Places", "My Mother at Sixty-Six", "Keeping Quiet", "A Thing of Beauty", "A Roadside Stand", "The Third Level", "The Tiger King", "Journey to the End of the Earth", "The Enemy", "Should Wizard Hit Mommy?", "On the Face of It", "Memories of Childhood"],
  "12-Fine Art": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "12-Geography": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8"],
  "12-Heritage Crafts": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9"],
  "12-Hindi": ["Antra - Bhag 2", "Aroh - Bhag 2", "Vitan - Bhag 2"],
  "12-History": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"],
  "12-Home Science": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "12-Informatics Practices": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "12-Mathematics": ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"],
  "12-New Age Graphics Design": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12"],
  "12-Physics": ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics", "Communication Systems"],
  "12-Political Science": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "12-Psychology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "12-Sangeet": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "12-Sanskrit": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"],
  "12-Sociology": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "12-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12"],

  "6-Arts": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17", "Chapter 18", "Chapter 19", "Chapter 20", "Chapter 21", "Chapter 22"],
  "6-English": ["Fables and Folk Tales", "Friendship", "Nurturing Nature", "Sports and Wellness", "Culture and Tradition"],
  "6-Hindi": ["मातृभूमि", "गोल", "पहली बूँद", "हार की जीत", "रहीम के दोहे", "मेरी माँ", "जलते चलो", "सत्रिया और बिहू नृत्य", "गाँव-शहर", "पार नज़र के", "चिड़िया की बच्ची", "हिंद देश के निवासी", "पत्र लेखन", "लोकगीत", "नए इलाके में...", "वन के मार्ग में"],
  "6-Kannada": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11"],
  "6-Malayalam": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"],
  "6-Marathi": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10"],
  "6-Mathematics": ["Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling and Presentation", "Prime Time", "Perimeter and Area", "Fractions", "Playing with Constructions", "Symmetry", "The Other Side of Zero"],
  "6-Nepali": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13"],
  "6-Physical Education and Well Being": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
  "6-Punjabi": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17", "Chapter 18", "Chapter 19"],
  "6-Sanskrit": ["वयं वर्णमालां पठामः", "संयुक्त-व्यञ्जनानि", "एषः कः? एषा का? एतत् किम्?", "अहं च त्वं च", "संख्यागणना ननु सरला", "अहं प्रातः उत्तिष्ठामि", "शूराः वयं धीराः वयं", "सः एव महान् चित्रकारः", "अतिथिदेवो भव", "बुद्धिः सर्वार्थसाधिका", "यः जानाति सः पण्डितः", "त्वं आपणं गच्छ", "पृथिव्यां त्रीणि रत्नानि", "आलस्यं हि मनुष्याणां शरीरस्थः महान् रिपुः", "माधवस्य प्रियं अङ्गम्", "वृक्षाः सत्पुरुषाः इव"],
  "6-Santhali": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11"],
  "6-Science": ["The Wonderful World of Science", "Diversity in the Living World", "Mindful Eating: A Path to a Healthy Body", "Exploring Magnets", "Measurement of Length and Motion", "Materials Around Us", "Temperature and its Measurement", "A Journey through States of Water", "Methods of Separation in Everyday Life", "Living Creatures: Exploring their Characteristics", "Nature's Treasures", "Beyond Earth"],
  "6-Social Science": ["Locating Places on the Earth", "Oceans and Continents", "Landforms and Life", "Timeline and Sources of History", "India, That Is Bharat", "The Beginnings of Indian Civilisation", "India's Cultural Roots", "Unity in Diversity, or 'Many in the One'", "Family and Community", "Grassroots Democracy – Part 1: Governance", "Grassroots Democracy – Part 2: Local Government in Rural Areas", "Grassroots Democracy – Part 3: Local Government in Urban Areas", "The Value of Work", "Economic Activities Around Us"],
  "6-Tamil": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13"],
  "6-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14"],
  "6-Vocational Education": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6"],
  "7-Arts": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17", "Chapter 18", "Chapter 19", "Chapter 20"],
  "7-English": ["Learning Together – The Day the River Spoke", "Learning Together – Try Again", "Learning Together – Three Days to See", "Wit and Humour – Animals, Birds and Dr. Dolittle", "Wit and Humour – A Funny Man", "Wit and Humour – Say the Right Thing", "Dreams and Discoveries – My Brother's Great Invention", "Dreams and Discoveries – Paper Boats", "Dreams and Discoveries – North, South, East, West", "Travel and Adventure – The Tunnel", "Travel and Adventure – Travel", "Travel and Adventure – Conquering the Summit", "Bravehearts – A Homage to Our Brave Soldiers", "Bravehearts – My Dear Soldiers", "Bravehearts – Rani Abbakka"],
  "7-Hindi": ["माँ, कह एक कहानी", "तीन बुद्धिमान", "फूल और काँटा", "पानी रे पानी", "नहीं होना बीमार", "गिरधर कविराय की कुण्डलियाँ", "वर्षा-बहार", "बिरजू महाराज से साक्षात्कार", "चिड़िया", "मीरा के पद"],
  "7-Mathematics": ["Large Numbers Around Us", "Arithmetic Expressions", "A Peek Beyond the Point", "Expressions using Letter-Numbers", "Parallel and Intersecting Lines", "Number Play", "A Tale of Three Intersecting Lines", "Working with Fractions", "Geometric Twins", "Operations with Integers", "Finding Common Ground", "Another Peek Beyond the Point", "Connecting the Dots…", "Constructions and Tilings", "Finding the Unknown"],
  "7-Physical Education and Well Being": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6"],
  "7-Sanskrit": ["वन्दे भारतमातरम्", "नित्यं पिबामः सुभाषितरसम्", "मित्राय नमः", "न लभ्यते चेत् आम्लं द्राक्षाफलम्", "सेवा हि परमो धर्मः", "क्रीडाम वयं श्लोकान्त्याक्षरीम्", "ईशावास्यम् इदं सर्वम्", "हितं मनोहारि च दुर्लभं वचः", "अन्नाद् भवन्ति भूतानि", "दशमः कः?", "द्वीपेषु रम्यः द्वीपोऽण्डमानः", "वीराङ्गना पन्नाधाया"],
  "7-Science": ["The Ever-Evolving World of Science", "Exploring Substances: Acidic, Basic and Neutral", "Electricity: Circuits and their Components", "The World of Metals and Non-metals", "Changes Around Us: Physical and Chemical", "Adolescence: A Stage of Growth and Change", "Heat Transfer in Nature", "Measurement of Time and Motion", "Life Processes in Animals", "Life Processes in Plants", "Light: Shadows and Reflections", "Earth, Moon and the Sun"],
  "7-Social Science": ["Our Earth: A Tapestry of Life", "Interior of the Earth", "Our Changing Planet", "Air Around Us", "Water: A Precious Resource", "Life in the Natural Regions", "The World of History", "Tribes and Nomads", "Devotional Paths", "The Making of Regional Cultures", "Political Formations in the 18th Century", "Equality in Indian Democracy", "State Government", "Gender and Society", "Media and Democracy", "Markets and Economic Development"],
  "7-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14"],
  "7-Vocational Education": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "8-Arts": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17", "Chapter 18", "Chapter 19"],
  "8-English": ["Unit 1: Fables and Folk Tales", "Unit 2: Friendship", "Unit 3: Nurturing Nature", "Unit 4: Sports and Wellness", "Unit 5: Culture and Tradition"],
  "8-Hindi": ["स्वदेश", "दो गौरैयाँ", "एक आशीर्वाद", "हरिद्वार", "कबीर के दोहे", "एक टोकरी भरी मिट्टी", "मत बाँधो", "नए मेहमान", "आदमी का अनुपात", "तरुण के स्वप्न"],
  "8-Mathematics": ["A Square and A Cube", "Power Play", "A Story of Numbers", "Quadrilaterals", "Number Play", "We Distribute, Yet Things Multiply", "Proportional Reasoning-1", "Fractions in Disguise", "The Baudhayana–Pythagoras Theorem", "Proportional Reasoning-2", "Exploring Some Geometric Themes", "Tales by Dots and Lines", "Algebra Play", "Area"],
  "8-Physical Education and Well Being": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6"],
  "8-Sanskrit": ["संगच्छध्वं संवदध्वम्", "अल्पानामपि वस्तूनां संहतिः कार्यसाधिका", "सुभाषितस्सं पीत्वा जीवनं सफलं कुरु", "प्रणम्यो देशभक्तोऽयं गोपबन्धुर्महामनाः", "गीता सुगीता कर्तव्या", "डिजिभारतम् – युगपरिवर्त", "मञ्जुलमञ्जूषा सुन्दरसुरभाषा", "पश्यत कोणमैशान्यं भारतस्य मनोहरम्", "कोऽरुक् ? कोऽरुक् ? कोऽरुक् ?", "सन्निमित्ते वरं त्यागः (क-भागः)", "सन्निमित्ते वरं त्यागः (ख-भागः)", "सम्यग्वर्णप्रयोगेण ब्रह्मलोके महीयते", "वर्णोच्चारण-शिक्षा १"],
  "8-Science": ["Exploring the Investigative World of Science", "The Invisible Living World: Beyond Our Naked Eye", "Health: The Ultimate Treasure", "Electricity: Magnetic and Heating Effects", "Exploring Forces", "Pressure, Winds, Storms, and Cyclones", "Particulate Nature of Matter", "Nature of Matter: Elements, Compounds, and Mixtures", "The Amazing World of Solutes, Solvents, and Solutions", "Light: Mirrors and Lenses", "Keeping Time with the Skies", "How Nature Works in Harmony", "Our Home: Earth, a Unique Life Sustaining Planet"],
  "8-Social Science": ["Natural Resources and Their Use", "Reshaping India's Political Map", "The Rise of the Marathas", "The Colonial Era in India", "Universal Franchise and India's Electoral System", "The Parliamentary System: Legislature and Executive", "Factors of Production", "Agriculture and Food Security", "Industries and Economic Development", "Human Resources and Employment", "The Constitution: A Living Document", "Understanding Secularism in India", "Parliamentary Government", "The Judiciary", "Social Justice and the Marginalised", "Economic Presence of the Government"],
  "8-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17", "Chapter 18", "Chapter 19", "Chapter 20", "Chapter 21", "Chapter 22"],
  "8-Vocational Education": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7"],
  "9-Arts": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15", "Chapter 16", "Chapter 17"],
  "9-English": ["How I Taught My Grandmother to Read", "The Pot Maker", "Winds of Change", "Vitamin-M", "The World of Limitless Possibilities", "Twin Melodies", "Carrier of Words", "Follow That Dream", "Bharat Our Land", "Gifts of Grace: Honouring our Vocations", "Canvas of Soil", "I Cannot Remember My Mother", "Nine Gold Medals", "A Friend Found in Music", "Words", "Believe in Yourself"],
  "9-Hindi": ["Kshitij - Bhag 1", "Kritika - Bhag 1", "Sanchayan - Bhag 1"],
  "9-Mathematics": ["Orienting Yourself: The Use of Coordinates", "Introduction to Linear Polynomials", "The World of Numbers", "Exploring Algebraic Identities", "I'm Up and Down, and Round and Round", "Measuring Space: Perimeter and Area", "The Mathematics of Maybe: Introduction to Probability", "Predicting What Comes Next?: Exploring Sequences and Progressions"],
  "9-Physical Education and Well Being": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6"],
  "9-Sanskrit": ["Shemushi - Bhag 1", "Abhyasvan Bhav"],
  "9-Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Improvement in Food Resources"],
  "9-Skill Education": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12"],
  "9-Social Science": ["The French Revolution", "Socialism in Europe", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World", "India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population", "What is Democracy?", "Constitutional Design", "Electoral Politics", "Working of Institutions", "Democratic Rights", "The Story of Village Palampur", "People as Resource", "Poverty as a Challenge", "Food Security in India"],
  "9-Urdu": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5", "Chapter 6", "Chapter 7", "Chapter 8", "Chapter 9", "Chapter 10", "Chapter 11", "Chapter 12", "Chapter 13", "Chapter 14", "Chapter 15"],
  "9-Vocational": ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
};

async function main() {
  console.log("🌱 Seeding database...");

  // Create classes
  for (const cls of classes) {
    await prisma.class.upsert({
      where: { number: cls.number },
      update: { name: cls.name },
      create: cls,
    });
  }

  // Create subjects and chapters
  for (const [classNum, subjectList] of Object.entries(subjectsByClass)) {
    const cls = await prisma.class.findUnique({ where: { number: parseInt(classNum) } });
    if (!cls) continue;

    for (const subjectName of subjectList) {
      const isHidden = HIDDEN_SUBJECTS.has(subjectName);
      const subject = await prisma.subject.create({
        data: {
          name: subjectName,
          classId: cls.id,
          order: subjectList.indexOf(subjectName),
          hidden: isHidden,
        },
      });

      const key = `${classNum}-${subjectName}`;
      const chapterList = chapters[key] || [];

      for (let i = 0; i < chapterList.length; i++) {
        await prisma.chapter.create({
          data: {
            number: i + 1,
            name: chapterList[i],
            subjectId: subject.id,
            classId: cls.id,
            order: i,
          },
        });
      }
    })
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
