// script.js - Shared JavaScript for Job Portal

// Data Models
class Job {
    constructor(id, title, company, location, description, salary = '') {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.description = description;
        this.salary = salary;
        this.createdAt = new Date().toISOString();
    }
}

class Applicant {
    constructor(jobId, name, email, phone, resumeName, resumeData, coverLetter = '') {
        this.id = Date.now() + Math.random();
        this.jobId = jobId;
        this.name = name;
        this.email = email;
        this.phone = phone || '';
        this.resumeName = resumeName;
        this.resumeData = resumeData;
        this.coverLetter = coverLetter;
        this.appliedAt = new Date().toISOString();
    }
}

// Global Data
let jobs = [];
let applicants = [];

// Initialize Data from localStorage
function initializeData() {
    const storedJobs = localStorage.getItem('jobhub_jobs');
    const storedApplicants = localStorage.getItem('jobhub_applicants');
    
    if (storedJobs) {
        jobs = JSON.parse(storedJobs);
    } else {
        // Sample jobs for demonstration
        jobs = [
            new Job(1001, 'Senior Frontend Developer', 'TechCorp', 'Remote', 'Looking for an experienced React developer with 5+ years of experience. Strong TypeScript skills required.', '$120,000 - $150,000'),
            new Job(1002, 'UX/UI Designer', 'CreativeStudio', 'New York, NY', 'Join our design team to create beautiful, user-centered experiences. Figma expertise required.', '$90,000 - $110,000'),
            new Job(1003, 'Backend Engineer', 'DataFlow', 'Austin, TX', 'Node.js, Python, and cloud architecture. Build scalable microservices.', '$130,000 - $160,000'),
            new Job(1004, 'Product Manager', 'InnovateLabs', 'San Francisco, CA', 'Lead product development from concept to launch. 3+ years PM experience.', '$140,000 - $180,000'),
            new Job(1005, 'DevOps Engineer', 'CloudNative', 'Remote', 'Kubernetes, AWS, CI/CD pipelines. Automation enthusiast.', '$125,000 - $155,000')
        ];
        saveJobs();
    }
    
    if (storedApplicants) {
        applicants = JSON.parse(storedApplicants);
    } else {
        // Sample applicants
        applicants = [
            new Applicant(1001, 'John Doe', 'john@example.com', '555-1234', 'john_resume.pdf', 'data:application/pdf;base64,Sample', 'Great opportunity!'),
            new Applicant(1001, 'Jane Smith', 'jane@example.com', '555-5678', 'jane_resume.pdf', 'data:application/pdf;base64,Sample', 'Excited to apply!'),
            new Applicant(1002, 'Mike Johnson', 'mike@example.com', '555-9012', 'mike_resume.pdf', 'data:application/pdf;base64,Sample', 'Love your design team!')
        ];
        saveApplicants();
    }
}

// Save functions
function saveJobs() {
    localStorage.setItem('jobhub_jobs', JSON.stringify(jobs));
}

function saveApplicants() {
    localStorage.setItem('jobhub_applicants', JSON.stringify(applicants));
}

// Helper: Escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============ RECRUITER PAGE (index.html) ============
if (document.getElementById('jobForm')) {
    const jobForm = document.getElementById('jobForm');
    const jobCountSpan = document.getElementById('jobCount');
    const clearAllJobsBtn = document.getElementById('clearAllJobsBtn');
    const recentJobsList = document.getElementById('recentJobsList');
    
    function updateRecruiterUI() {
        if (jobCountSpan) jobCountSpan.textContent = jobs.length;
        displayRecentJobs();
    }
    
    function displayRecentJobs() {
        if (!recentJobsList) return;
        if (jobs.length === 0) {
            recentJobsList.innerHTML = '<p class="text-muted text-center">No jobs posted yet.</p>';
            return;
        }
        
        const recentJobs = [...jobs].reverse().slice(0, 5);
        recentJobsList.innerHTML = recentJobs.map(job => `
            <div class="recent-job-item">
                <strong>${escapeHtml(job.title)}</strong><br>
                <small class="text-muted">${escapeHtml(job.company)} • ${escapeHtml(job.location)}</small>
            </div>
        `).join('');
    }
    
    if (jobForm) {
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('title').value.trim();
            const company = document.getElementById('company').value.trim();
            const location = document.getElementById('location').value.trim();
            const description = document.getElementById('description').value.trim();
            const salary = document.getElementById('salary')?.value.trim() || '';
            
            if (!title || !company || !location || !description) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const newJob = new Job(Date.now(), title, company, location, description, salary);
            jobs.push(newJob);
            saveJobs();
            
            jobForm.reset();
            updateRecruiterUI();
            
            alert('✅ Job posted successfully!');
        });
    }
    
    if (clearAllJobsBtn) {
        clearAllJobsBtn.addEventListener('click', () => {
            if (confirm('⚠️ Are you sure? This will delete ALL job posts. This action cannot be undone.')) {
                jobs = [];
                saveJobs();
                updateRecruiterUI();
                alert('All jobs have been cleared.');
            }
        });
    }
    
    updateRecruiterUI();
}

// ============ JOBS PAGE (jobs.html) ============
if (document.getElementById('jobsGrid')) {
    const jobsGrid = document.getElementById('jobsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterLocation = document.getElementById('filterLocation');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const totalJobsCount = document.getElementById('totalJobsCount');
    const emptyJobsState = document.getElementById('emptyJobsState');
    let currentModalJobId = null;
    
    function populateLocationFilter() {
        if (!filterLocation) return;
        const locations = [...new Set(jobs.map(job => job.location))];
        filterLocation.innerHTML = '<option value="">All Locations</option>' +
            locations.map(loc => `<option value="${escapeHtml(loc)}">${escapeHtml(loc)}</option>`).join('');
    }
    
    function filterJobs() {
        const searchTerm = searchInput?.value.toLowerCase() || '';
        const locationFilter = filterLocation?.value || '';
        
        const filtered = jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                                 job.company.toLowerCase().includes(searchTerm) ||
                                 job.location.toLowerCase().includes(searchTerm) ||
                                 job.description.toLowerCase().includes(searchTerm);
            const matchesLocation = !locationFilter || job.location === locationFilter;
            return matchesSearch && matchesLocation;
        });
        
        displayJobs(filtered);
        
        if (totalJobsCount) totalJobsCount.textContent = filtered.length;
        if (emptyJobsState) {
            if (filtered.length === 0) emptyJobsState.classList.remove('d-none');
            else emptyJobsState.classList.add('d-none');
        }
    }
    
    function displayJobs(jobsToShow) {
        if (!jobsGrid) return;
        
        if (jobsToShow.length === 0) {
            jobsGrid.innerHTML = '';
            return;
        }
        
        jobsGrid.innerHTML = jobsToShow.map(job => `
            <div class="col-md-6 col-lg-4">
                <div class="job-card">
                    <div class="job-title">${escapeHtml(job.title)}</div>
                    <div class="job-company">${escapeHtml(job.company)}</div>
                    <div class="job-location">
                        <i class="bi bi-geo-alt-fill"></i> ${escapeHtml(job.location)}
                    </div>
                    <div class="job-description">
                        ${escapeHtml(job.description.substring(0, 100))}${job.description.length > 100 ? '...' : ''}
                    </div>
                    ${job.salary ? `<div class="mb-2"><span class="badge bg-success">💰 ${escapeHtml(job.salary)}</span></div>` : ''}
                    <button class="btn-gradient w-100 mt-2" onclick="openApplyModal(${job.id}, '${escapeHtml(job.title).replace(/'/g, "\\'")}')">
                        <i class="bi bi-send"></i> Apply Now
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    window.openApplyModal = function(jobId, jobTitle) {
        currentModalJobId = jobId;
        const modal = new bootstrap.Modal(document.getElementById('applyModal'));
        const jobTitlePreview = document.getElementById('jobTitlePreview');
        if (jobTitlePreview) {
            jobTitlePreview.innerHTML = `<strong>Applying for:</strong> ${jobTitle}`;
        }
        document.getElementById('jobId').value = jobId;
        modal.show();
    };
    
    const applyForm = document.getElementById('applyForm');
    if (applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const jobId = parseInt(document.getElementById('jobId').value);
            const name = document.getElementById('applicantName').value.trim();
            const email = document.getElementById('applicantEmail').value.trim();
            const phone = document.getElementById('applicantPhone')?.value.trim() || '';
            const coverLetter = document.getElementById('coverLetter')?.value.trim() || '';
            const fileInput = document.getElementById('resumeFile');
            
            if (!name || !email) {
                alert('Please fill in your name and email.');
                return;
            }
            
            if (!fileInput.files.length) {
                alert('Please upload your resume.');
                return;
            }
            
            const file = fileInput.files[0];
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only PDF, DOC, and DOCX files are allowed.');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(evt) {
                const newApplicant = new Applicant(jobId, name, email, phone, file.name, evt.target.result, coverLetter);
                applicants.push(newApplicant);
                saveApplicants();
                
                bootstrap.Modal.getInstance(document.getElementById('applyModal')).hide();
                applyForm.reset();
                
                alert(`🎉 Application submitted successfully! We'll contact you at ${email}`);
            };
            reader.readAsDataURL(file);
        });
    }
    
    if (searchInput) searchInput.addEventListener('input', filterJobs);
    if (filterLocation) filterLocation.addEventListener('change', filterJobs);
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (filterLocation) filterLocation.value = '';
            filterJobs();
        });
    }
    
    initializeData();
    populateLocationFilter();
    filterJobs();
}

// ============ CANDIDATES PAGE (candidates.html) ============
if (document.getElementById('applicantsGrid')) {
    const applicantsGrid = document.getElementById('applicantsGrid');
    const searchApplicantInput = document.getElementById('searchApplicantInput');
    const filterJob = document.getElementById('filterJob');
    const resetApplicantFilters = document.getElementById('resetApplicantFilters');
    const totalApplicantsCount = document.getElementById('totalApplicantsCount');
    const emptyApplicantsState = document.getElementById('emptyApplicantsState');
    const statsCards = document.getElementById('statsCards');
    const exportBtn = document.getElementById('exportDataBtn');
    
    function populateJobFilter() {
        if (!filterJob) return;
        const jobOptions = [...new Set(applicants.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return job ? job.title : 'Unknown Job';
        }))];
        filterJob.innerHTML = '<option value="">All Jobs</option>' +
            jobOptions.map(jobTitle => `<option value="${escapeHtml(jobTitle)}">${escapeHtml(jobTitle)}</option>`).join('');
    }
    
    function updateStats() {
        if (!statsCards) return;
        
        const totalApps = applicants.length;
        const uniqueJobs = [...new Set(applicants.map(app => app.jobId))].length;
        
        statsCards.innerHTML = `
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-number">${totalApps}</div>
                    <div class="stat-label">Total Applications</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-number">${uniqueJobs}</div>
                    <div class="stat-label">Jobs Applied To</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-number">${jobs.length}</div>
                    <div class="stat-label">Open Positions</div>
                </div>
            </div>
        `;
    }
    
    function filterApplicants() {
        const searchTerm = searchApplicantInput?.value.toLowerCase() || '';
        const jobFilter = filterJob?.value || '';
        
        const filtered = applicants.filter(app => {
            const job = jobs.find(j => j.id === app.jobId);
            const jobTitle = job ? job.title : 'Unknown Job';
            
            const matchesSearch = app.name.toLowerCase().includes(searchTerm) ||
                                 app.email.toLowerCase().includes(searchTerm) ||
                                 jobTitle.toLowerCase().includes(searchTerm);
            const matchesJob = !jobFilter || jobTitle === jobFilter;
            return matchesSearch && matchesJob;
        });
        
        displayApplicants(filtered);
        
        if (totalApplicantsCount) totalApplicantsCount.textContent = filtered.length;
        if (emptyApplicantsState) {
            if (filtered.length === 0) emptyApplicantsState.classList.remove('d-none');
            else emptyApplicantsState.classList.add('d-none');
        }
    }
    
    function displayApplicants(applicantsToShow) {
        if (!applicantsGrid) return;
        
        if (applicantsToShow.length === 0) {
            applicantsGrid.innerHTML = '';
            return;
        }
        
        applicantsGrid.innerHTML = applicantsToShow.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            const jobTitle = job ? job.title : 'Position Removed';
            const company = job ? job.company : '';
            
            return `
                <div class="col-md-6 col-lg-4">
                    <div class="applicant-card">
                        <div class="applicant-name">${escapeHtml(app.name)}</div>
                        <div class="applicant-email">
                            <i class="bi bi-envelope"></i> ${escapeHtml(app.email)}
                        </div>
                        ${app.phone ? `<div class="applicant-email"><i class="bi bi-telephone"></i> ${escapeHtml(app.phone)}</div>` : ''}
                        <div class="applied-job">${escapeHtml(jobTitle)}</div>
                        ${company ? `<small class="text-muted d-block mb-2">🏢 ${escapeHtml(company)}</small>` : ''}
                        <a href="${app.resumeData}" download="${escapeHtml(app.resumeName)}" class="resume-link">
                            <i class="bi bi-file-earmark-pdf"></i> ${escapeHtml(app.resumeName)}
                        </a>
                        <button class="btn btn-sm btn-outline-primary-custom mt-2 w-100" onclick="viewApplicantDetails(${app.id})">
                            <i class="bi bi-eye"></i> View Details
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    window.viewApplicantDetails = function(applicantId) {
        const applicant = applicants.find(a => a.id === applicantId);
        if (!applicant) return;
        
        const job = jobs.find(j => j.id === applicant.jobId);
        const jobTitle = job ? job.title : 'Position Removed';
        const company = job ? job.company : '';
        
        const modalContent = document.getElementById('applicantDetailContent');
        modalContent.innerHTML = `
            <div class="row">
                <div class="col-12 mb-3">
                    <h5><i class="bi bi-person-circle"></i> Personal Information</h5>
                    <hr>
                    <p><strong>Name:</strong> ${escapeHtml(applicant.name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(applicant.email)}</p>
                    ${applicant.phone ? `<p><strong>Phone:</strong> ${escapeHtml(applicant.phone)}</p>` : ''}
                </div>
                <div class="col-12 mb-3">
                    <h5><i class="bi bi-briefcase"></i> Position Details</h5>
                    <hr>
                    <p><strong>Applied For:</strong> ${escapeHtml(jobTitle)}</p>
                    ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
                    <p><strong>Applied On:</strong> ${new Date(applicant.appliedAt).toLocaleString()}</p>
                </div>
                ${applicant.coverLetter ? `
                <div class="col-12 mb-3">
                    <h5><i class="bi bi-chat-text"></i> Cover Letter</h5>
                    <hr>
                    <p class="p-3 bg-light rounded">${escapeHtml(applicant.coverLetter)}</p>
                </div>
                ` : ''}
                <div class="col-12">
                    <h5><i class="bi bi-file-earmark"></i> Resume</h5>
                    <hr>
                    <a href="${applicant.resumeData}" download="${escapeHtml(applicant.resumeName)}" class="btn-gradient">
                        <i class="bi bi-download"></i> Download Resume
                    </a>
                </div>
            </div>
        `;
        
        new bootstrap.Modal(document.getElementById('applicantDetailModal')).show();
    };
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const csvRows = [['Name', 'Email', 'Phone', 'Job Title', 'Company', 'Applied Date', 'Resume Name']];
            applicants.forEach(app => {
                const job = jobs.find(j => j.id === app.jobId);
                csvRows.push([
                    app.name,
                    app.email,
                    app.phone || '',
                    job ? job.title : 'Unknown',
                    job ? job.company : '',
                    new Date(app.appliedAt).toLocaleString(),
                    app.resumeName
                ]);
            });
            
            const csvContent = csvRows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'job_applications.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }
    
    if (searchApplicantInput) searchApplicantInput.addEventListener('input', filterApplicants);
    if (filterJob) filterJob.addEventListener('change', filterApplicants);
    if (resetApplicantFilters) {
        resetApplicantFilters.addEventListener('click', () => {
            if (searchApplicantInput) searchApplicantInput.value = '';
            if (filterJob) filterJob.value = '';
            filterApplicants();
        });
    }
    
    initializeData();
    updateStats();
    populateJobFilter();
    filterApplicants();
}

// Initial load for any page
initializeData();