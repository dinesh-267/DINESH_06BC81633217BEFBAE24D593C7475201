// script.js - Smart LMS with AI Quiz Generation

// Data Models
class Course {
    constructor(id, title, description, category, difficulty, quiz) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.difficulty = difficulty;
        this.quiz = quiz;
        this.createdAt = new Date().toISOString();
        this.userScores = JSON.parse(localStorage.getItem(`course_${id}_scores`)) || [];
    }
}

// AI Quiz Generator - Creates intelligent questions based on course content
class AIQuizGenerator {
    static generateQuiz(courseTitle, courseDescription, category, difficulty) {
        const questions = [];
        const topic = courseTitle.toLowerCase();
        const desc = courseDescription.toLowerCase();
        
        // Common topics detection
        const topics = {
            programming: ['python', 'javascript', 'java', 'coding', 'programming', 'developer'],
            web: ['html', 'css', 'react', 'angular', 'vue', 'web', 'frontend', 'backend'],
            data: ['data', 'sql', 'database', 'analytics', 'machine learning', 'ai'],
            business: ['business', 'management', 'leadership', 'marketing', 'sales'],
            design: ['design', 'ui', 'ux', 'graphic', 'figma', 'adobe']
        };
        
        let detectedTopics = [];
        for (const [key, keywords] of Object.entries(topics)) {
            if (keywords.some(kw => topic.includes(kw) || desc.includes(kw))) {
                detectedTopics.push(key);
            }
        }
        
        if (detectedTopics.length === 0) detectedTopics = ['general'];
        
        // Generate 8 questions based on detected topics
        const questionCount = 8;
        
        for (let i = 0; i < questionCount; i++) {
            let question = {};
            
            if (detectedTopics.includes('programming') || detectedTopics.includes('web')) {
                question = this.getProgrammingQuestion(courseTitle, i);
            } else if (detectedTopics.includes('data')) {
                question = this.getDataQuestion(courseTitle, i);
            } else if (detectedTopics.includes('business')) {
                question = this.getBusinessQuestion(courseTitle, i);
            } else if (detectedTopics.includes('design')) {
                question = this.getDesignQuestion(courseTitle, i);
            } else {
                question = this.getGeneralQuestion(courseTitle, i);
            }
            
            // Adjust difficulty
            if (difficulty === 'Advanced') {
                question.options = this.makeOptionsHarder(question.options);
            } else if (difficulty === 'Beginner') {
                question.options = this.makeOptionsEasier(question.options);
            }
            
            questions.push(question);
        }
        
        return questions;
    }
    
    static getProgrammingQuestion(courseTitle, index) {
        const questions = [
            {
                question: `What is the primary purpose of ${courseTitle}?`,
                options: [
                    "Web development",
                    "Data processing",
                    "Application development",
                    "System automation"
                ],
                answer: 2
            },
            {
                question: "Which of the following is a key concept in programming?",
                options: [
                    "Variables and Data Types",
                    "Color Theory",
                    "Typography",
                    "Market Analysis"
                ],
                answer: 0
            },
            {
                question: "What is version control used for?",
                options: [
                    "Managing code changes",
                    "Designing interfaces",
                    "Testing performance",
                    "Deploying applications"
                ],
                answer: 0
            },
            {
                question: "Which is a common programming paradigm?",
                options: [
                    "Object-Oriented Programming",
                    "Linear Design",
                    "Circular Logic",
                    "Sequential Art"
                ],
                answer: 0
            },
            {
                question: "What does API stand for?",
                options: [
                    "Application Programming Interface",
                    "Advanced Program Integration",
                    "Application Protocol Interface",
                    "Automated Programming Interface"
                ],
                answer: 0
            },
            {
                question: "Which is important for code quality?",
                options: [
                    "Code Review",
                    "Fast Typing",
                    "Many Comments",
                    "Long Functions"
                ],
                answer: 0
            },
            {
                question: "What is debugging?",
                options: [
                    "Finding and fixing errors",
                    "Writing documentation",
                    "Designing architecture",
                    "Testing performance"
                ],
                answer: 0
            },
            {
                question: "Which tool is used for package management?",
                options: [
                    "npm (Node Package Manager)",
                    "Photoshop",
                    "Excel",
                    "WordPress"
                ],
                answer: 0
            }
        ];
        return questions[index % questions.length];
    }
    
    static getDataQuestion(courseTitle, index) {
        const questions = [
            {
                question: "What is a database?",
                options: [
                    "Organized collection of data",
                    "Programming language",
                    "Web framework",
                    "Operating system"
                ],
                answer: 0
            },
            {
                question: "What does SQL stand for?",
                options: [
                    "Structured Query Language",
                    "Simple Query Logic",
                    "System Query Language",
                    "Sequential Query Language"
                ],
                answer: 0
            },
            {
                question: "What is data normalization?",
                options: [
                    "Reducing data redundancy",
                    "Increasing data size",
                    "Encrypting data",
                    "Backing up data"
                ],
                answer: 0
            },
            {
                question: "Which is a NoSQL database?",
                options: [
                    "MongoDB",
                    "MySQL",
                    "PostgreSQL",
                    "Oracle"
                ],
                answer: 0
            },
            {
                question: "What is ETL in data processing?",
                options: [
                    "Extract, Transform, Load",
                    "Edit, Test, Launch",
                    "Execute, Transfer, Link",
                    "Evaluate, Track, Log"
                ],
                answer: 0
            }
        ];
        return questions[index % questions.length];
    }
    
    static getBusinessQuestion(courseTitle, index) {
        const questions = [
            {
                question: "What is SWOT analysis?",
                options: [
                    "Strengths, Weaknesses, Opportunities, Threats",
                    "Sales, Workflow, Operations, Technology",
                    "Strategy, Wins, Objectives, Tactics",
                    "System, Workflow, Organization, Timeline"
                ],
                answer: 0
            },
            {
                question: "What does ROI stand for?",
                options: [
                    "Return on Investment",
                    "Rate of Interest",
                    "Risk of Investment",
                    "Revenue on Income"
                ],
                answer: 0
            },
            {
                question: "What is a business model?",
                options: [
                    "Plan for generating revenue",
                    "Company logo",
                    "Employee handbook",
                    "Office layout"
                ],
                answer: 0
            },
            {
                question: "What is market segmentation?",
                options: [
                    "Dividing target market into groups",
                    "Increasing market share",
                    "Reducing competition",
                    "Setting prices"
                ],
                answer: 0
            }
        ];
        return questions[index % questions.length];
    }
    
    static getDesignQuestion(courseTitle, index) {
        const questions = [
            {
                question: "What is UX design?",
                options: [
                    "User Experience Design",
                    "Universal XML Design",
                    "User Export Design",
                    "Ultimate X Design"
                ],
                answer: 0
            },
            {
                question: "What is color theory?",
                options: [
                    "Guide for color combinations",
                    "Physics of light",
                    "Painting techniques",
                    "Digital art tools"
                ],
                answer: 0
            },
            {
                question: "What is typography?",
                options: [
                    "Art of arranging text",
                    "Type of photography",
                    "Graphic software",
                    "Printing technique"
                ],
                answer: 0
            },
            {
                question: "What is responsive design?",
                options: [
                    "Design that adapts to screen size",
                    "Fast loading design",
                    "Interactive elements",
                    "Animation-heavy design"
                ],
                answer: 0
            }
        ];
        return questions[index % questions.length];
    }
    
    static getGeneralQuestion(courseTitle, index) {
        return {
            question: `What is a key learning objective in ${courseTitle}?`,
            options: [
                "Understanding core concepts",
                "Memorizing facts",
                "Practical application",
                "Theoretical knowledge"
            ],
            answer: 0
        };
    }
    
    static makeOptionsHarder(options) {
        // Add more challenging variations
        return options.map(opt => opt + " (Advanced)");
    }
    
    static makeOptionsEasier(options) {
        // Make options simpler
        return options.map(opt => opt.replace(" (Advanced)", ""));
    }
}

// Storage Manager
class StorageManager {
    static getCourses() {
        const courses = localStorage.getItem('lms_courses');
        return courses ? JSON.parse(courses) : [];
    }
    
    static saveCourse(course) {
        const courses = this.getCourses();
        courses.push(course);
        localStorage.setItem('lms_courses', JSON.stringify(courses));
        return course;
    }
    
    static updateCourse(courseId, updatedCourse) {
        const courses = this.getCourses();
        const index = courses.findIndex(c => c.id === courseId);
        if (index !== -1) {
            courses[index] = updatedCourse;
            localStorage.setItem('lms_courses', JSON.stringify(courses));
        }
    }
    
    static deleteCourse(courseId) {
        let courses = this.getCourses();
        courses = courses.filter(c => c.id !== courseId);
        localStorage.setItem('lms_courses', JSON.stringify(courses));
        localStorage.removeItem(`course_${courseId}_scores`);
    }
    
    static saveScore(courseId, score, totalQuestions) {
        const scores = JSON.parse(localStorage.getItem(`course_${courseId}_scores`)) || [];
        scores.push({
            score: score,
            total: totalQuestions,
            date: new Date().toISOString(),
            percentage: (score / totalQuestions) * 100
        });
        localStorage.setItem(`course_${courseId}_scores`, JSON.stringify(scores));
    }
    
    static getScores(courseId) {
        return JSON.parse(localStorage.getItem(`course_${courseId}_scores`)) || [];
    }
}

// ============ INDEX PAGE (Home) ============
if (document.getElementById('previewCourses')) {
    function displayPreviewCourses() {
        const courses = StorageManager.getCourses();
        const previewContainer = document.getElementById('previewCourses');
        const recentCourses = courses.slice(-3).reverse();
        
        if (recentCourses.length === 0) {
            previewContainer.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">No courses yet. Be the first to create one!</p>
                    <a href="create-course.html" class="btn btn-primary">Create Course</a>
                </div>
            `;
            return;
        }
        
        previewContainer.innerHTML = recentCourses.map(course => `
            <div class="col-md-4">
                <div class="course-card">
                    <div class="course-header">
                        <h5 class="mb-0">${escapeHtml(course.title)}</h5>
                        <span class="course-badge">${escapeHtml(course.difficulty)}</span>
                    </div>
                    <div class="course-body">
                        <p class="course-description">${escapeHtml(course.description.substring(0, 100))}...</p>
                        <div class="course-meta">
                            <span><i class="bi bi-tag"></i> ${escapeHtml(course.category)}</span>
                            <span><i class="bi bi-question-circle"></i> ${course.quiz.length} Questions</span>
                        </div>
                    </div>
                    <div class="course-footer">
                        <a href="course-details.html?id=${course.id}" class="btn btn-primary btn-sm w-100">View Course</a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    displayPreviewCourses();
}

// ============ CREATE COURSE PAGE ============
if (document.getElementById('createCourseForm')) {
    const createForm = document.getElementById('createCourseForm');
    const previewQuestions = document.getElementById('previewQuestions');
    const generatedQuestionsList = document.getElementById('generatedQuestionsList');
    
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('courseTitle').value.trim();
        const description = document.getElementById('courseDesc').value.trim();
        const category = document.getElementById('courseCategory').value;
        const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
        
        if (!title || !description) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Generate AI Quiz
        const quiz = AIQuizGenerator.generateQuiz(title, description, category, difficulty);
        
        // Create course
        const newCourse = new Course(
            Date.now(),
            title,
            description,
            category,
            difficulty,
            quiz
        );
        
        StorageManager.saveCourse(newCourse);
        
        // Show preview
        generatedQuestionsList.innerHTML = `
            <h5>AI Generated Questions (${quiz.length} questions):</h5>
            ${quiz.map((q, idx) => `
                <div class="mb-3 p-3 bg-light rounded">
                    <strong>Q${idx + 1}: ${escapeHtml(q.question)}</strong>
                    <ul class="mt-2">
                        ${q.options.map(opt => `<li>${escapeHtml(opt)}</li>`).join('')}
                    </ul>
                    <small class="text-success">Answer: ${escapeHtml(q.options[q.answer])}</small>
                </div>
            `).join('')}
        `;
        
        previewQuestions.style.display = 'block';
        createForm.reset();
        
        // Scroll to preview
        previewQuestions.scrollIntoView({ behavior: 'smooth' });
    });
}

// ============ MY COURSES PAGE ============
if (document.getElementById('coursesGrid')) {
    let currentQuizCourse = null;
    let currentQuizAnswers = {};
    
    function displayCourses() {
        const courses = StorageManager.getCourses();
        const searchTerm = document.getElementById('searchCourse')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('filterCategory')?.value || '';
        const totalBadge = document.getElementById('totalCoursesBadge');
        const emptyState = document.getElementById('emptyState');
        const coursesGrid = document.getElementById('coursesGrid');
        
        let filteredCourses = courses;
        
        if (searchTerm) {
            filteredCourses = filteredCourses.filter(c => 
                c.title.toLowerCase().includes(searchTerm) ||
                c.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (categoryFilter) {
            filteredCourses = filteredCourses.filter(c => c.category === categoryFilter);
        }
        
        if (totalBadge) {
            totalBadge.textContent = `${filteredCourses.length} Course${filteredCourses.length !== 1 ? 's' : ''}`;
        }
        
        if (filteredCourses.length === 0) {
            if (emptyState) emptyState.classList.remove('d-none');
            if (coursesGrid) coursesGrid.innerHTML = '';
            return;
        }
        
        if (emptyState) emptyState.classList.add('d-none');
        
        if (coursesGrid) {
            coursesGrid.innerHTML = filteredCourses.map(course => {
                const scores = StorageManager.getScores(course.id);
                const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.percentage)) : 0;
                
                return `
                    <div class="col-md-6 col-lg-4">
                        <div class="course-card">
                            <div class="course-header">
                                <h5 class="mb-0">${escapeHtml(course.title)}</h5>
                                <span class="course-badge">${escapeHtml(course.difficulty)}</span>
                            </div>
                            <div class="course-body">
                                <p class="course-description">${escapeHtml(course.description.substring(0, 120))}${course.description.length > 120 ? '...' : ''}</p>
                                <div class="course-meta">
                                    <span><i class="bi bi-tag"></i> ${escapeHtml(course.category)}</span>
                                    <span><i class="bi bi-question-circle"></i> ${course.quiz.length} Qs</span>
                                    <span><i class="bi bi-pencil-square"></i> ${scores.length} attempts</span>
                                </div>
                                ${scores.length > 0 ? `
                                    <div class="mt-2">
                                        <small>Best Score: ${bestScore.toFixed(0)}%</small>
                                        <div class="progress-custom mt-1">
                                            <div class="progress-bar" style="width: ${bestScore}%"></div>
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                            <div class="course-footer">
                                <button class="btn btn-primary btn-sm w-100" onclick="startQuiz(${course.id})">
                                    <i class="bi bi-play-fill"></i> Take Quiz
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="deleteCourse(${course.id})">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
    
    window.startQuiz = function(courseId) {
        const courses = StorageManager.getCourses();
        currentQuizCourse = courses.find(c => c.id === courseId);
        if (!currentQuizCourse) return;
        
        const quizModalBody = document.getElementById('quizQuestions');
        currentQuizAnswers = {};
        
        quizModalBody.innerHTML = currentQuizCourse.quiz.map((q, idx) => `
            <div class="quiz-question">
                <div class="question-text">${idx + 1}. ${escapeHtml(q.question)}</div>
                ${q.options.map((opt, optIdx) => `
                    <div class="quiz-option" onclick="selectAnswer(${idx}, ${optIdx})">
                        <input type="radio" name="q${idx}" value="${optIdx}" id="q${idx}_${optIdx}">
                        <label for="q${idx}_${optIdx}">${escapeHtml(opt)}</label>
                    </div>
                `).join('')}
            </div>
        `).join('');
        
        new bootstrap.Modal(document.getElementById('quizModal')).show();
    };
    
    window.selectAnswer = function(questionIndex, answerIndex) {
        currentQuizAnswers[questionIndex] = answerIndex;
        const radio = document.getElementById(`q${questionIndex}_${answerIndex}`);
        if (radio) radio.checked = true;
    };
    
    window.submitQuiz = function() {
        if (!currentQuizCourse) return;
        
        let score = 0;
        currentQuizCourse.quiz.forEach((q, idx) => {
            if (currentQuizAnswers[idx] === q.answer) {
                score++;
            }
        });
        
        StorageManager.saveScore(currentQuizCourse.id, score, currentQuizCourse.quiz.length);
        
        const percentage = (score / currentQuizCourse.quiz.length) * 100;
        let message = '';
        if (percentage >= 80) message = 'Excellent! 🎉';
        else if (percentage >= 60) message = 'Good job! 👍';
        else if (percentage >= 40) message = 'Keep practicing! 📚';
        else message = 'Review the material and try again! 💪';
        
        alert(`Quiz Complete!\n\nScore: ${score}/${currentQuizCourse.quiz.length} (${percentage.toFixed(0)}%)\n\n${message}`);
        
        // Close modal and refresh display
        bootstrap.Modal.getInstance(document.getElementById('quizModal')).hide();
        displayCourses();
    };
    
    window.deleteCourse = function(courseId) {
        if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            StorageManager.deleteCourse(courseId);
            displayCourses();
        }
    };
    
    // Event listeners for search/filter
    const searchInput = document.getElementById('searchCourse');
    const categoryFilter = document.getElementById('filterCategory');
    const resetBtn = document.getElementById('resetFilters');
    
    if (searchInput) searchInput.addEventListener('input', displayCourses);
    if (categoryFilter) categoryFilter.addEventListener('change', displayCourses);
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = '';
            displayCourses();
        });
    }
    
    const clearAllBtn = document.getElementById('clearAllCourses');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('⚠️ WARNING: This will delete ALL courses and all quiz scores. This cannot be undone. Continue?')) {
                localStorage.removeItem('lms_courses');
                displayCourses();
            }
        });
    }
    
    displayCourses();
}

// Helper function
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}