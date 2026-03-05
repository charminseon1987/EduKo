import React from 'react';
import BottomNav from '../components/BottomNav';
import './EducationalPrograms.css';

const EducationalPrograms = () => {
    const courses = [
        {
            id: 1,
            title: 'Generative AI: Master Large Language Models',
            instructor: 'Dr. Sarah Jenkins • AI Research Head',
            rating: 4.9,
            students: '12.4k',
            price: '$84.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3OCQrKQUjzdZwjQtow6gnNmMQ7J-z0gyRLMaxDuYa7YJg8S7J2PRbPQRqt31lHOuPSbUpWvJNqR8f22xkFgWI_0_c5i4ysd7sax1hgw9vMN5CmnY-K7FvHl4p2ElwgJCwOePU7D9bWXKI23mP8TK-c1u92rY-NswGudhWAjpjVsDsTwOy2QiN_nZPaTzPH8337E8E4LsmjnCgSMckuV4sI0Kat3eAtHn70u-yO32WUhNInO6CrxrIw4Tnm9AOoHzNRBHNobjAqGE',
            isBestseller: true
        },
        {
            id: 2,
            title: 'Advanced Machine Learning Foundations',
            instructor: 'Prof. Michael Chen • Data Science Institute',
            rating: 4.7,
            students: '8.2k',
            price: '$79.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt87JYr8orj_oj4jqsOcjYPkobT7HF6scQtO4iFx4zfVMerFyJycioxrgomBtaGstLZNsbI95A7wOorkfrIv1XLFZPXCWJCHehtJSJ0u7lYCTzTr1mIUhzsXZu3aysW29dyxc6eQPmZK3uINQgEBxfjRJ1R0QUoHMRioiqaopfk8vlFLTbw3ReuMZElnDib6bZRTK8RFSRa14VcbPI8-f7BUFhJK31Lf64arcewRbyH_yzRhUszeo-InkfoRTLyZd0Ox2tXPt4HVc',
            isBestseller: false
        }
    ];

    const newArrivals = [
        {
            id: 1,
            title: 'AI Ethics & Governance',
            instructor: 'EduKo Certificate Program',
            rating: 5.0,
            price: '$45.00',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDw1WOQISn36traVX_BR2SPVxuwH1ax1ZeNSGYq0ag-Azrj81JbaQ4nQiFJRiDtkHOgL366brvQaLMqDZi3zjcjN66Izmrx68WHjCpZ5wJSeG9IzMIdJ1DJre3SHWeMKvrEgvBSKUp2YA42Y1QHstbtftV14c3xkkMC02HH0UAtJ7lu1ZO9A8p5FSx6bKr-L1wIOc29EVqq5dW4t5i52zbGRxW4-3kKgg7ovNzl7TC-ZP0eEuy65oWSnf4GWqPv8YSIydldof1vZng'
        },
        {
            id: 2,
            title: 'Prompt Engineering for Teams',
            instructor: 'Alex Rivera • Prompt Architect',
            rating: 4.8,
            price: '$29.99',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCFNVLhRAEfB4L60_WdUn9RTWw5PTgupZ0rdAljrnWOU3XfONr1U8wOXTi0y2JpeOZxTgexdcij5nK257W7YCOjKOQhUAbF3s_Wzuyg4ZT-atWKaJq6Gvk1IV8RRDtacYgu0Iws-6-78SdcYnPsDWMwcJLvxywgxmCnG6WMFsI1KILQx7Lp0dzgY7nphqmauKmmW8pxO1dJyP0cpXX8kaWcED7K8alVvBN3GEWCLOVas7R9E-BjRAaLXYiVSSwg51yCxi59kNWZcE'
        }
    ];

    return (
        <div className="page-container fade-in">
            <header className="page-header">
                <div className="header-top">
                    <button className="icon-btn">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="header-title">Educational Programs</h2>
                    <button className="icon-btn">
                        <span className="material-symbols-outlined">tune</span>
                    </button>
                </div>
                <div className="search-bar-container">
                    <div className="search-bar">
                        <span className="material-symbols-outlined search-icon">search</span>
                        <input type="text" placeholder="Search AI courses..." className="search-input" />
                    </div>
                </div>
                <div className="categories-scroll no-scrollbar">
                    <button className="category-chip active">All Topics</button>
                    <button className="category-chip">Machine Learning <span className="material-symbols-outlined">expand_more</span></button>
                    <button className="category-chip">NLP <span className="material-symbols-outlined">expand_more</span></button>
                    <button className="category-chip">GenAI</button>
                </div>
            </header>

            <main className="page-content no-scrollbar">
                <section className="course-section">
                    <div className="section-header">
                        <h3>Popular AI Courses</h3>
                        <button className="see-all">See all</button>
                    </div>
                    <div className="course-list">
                        {courses.map(course => (
                            <div key={course.id} className="course-card">
                                <div className="card-image-wrap">
                                    <img src={course.image} alt={course.title} />
                                    {course.isBestseller && <span className="badge">Bestseller</span>}
                                </div>
                                <div className="card-content">
                                    <div className="card-title-row">
                                        <h4>{course.title}</h4>
                                        <span className="material-symbols-outlined bookmark">bookmark</span>
                                    </div>
                                    <p className="instructor">{course.instructor}</p>
                                    <div className="card-footer">
                                        <div className="rating">
                                            <span className="material-symbols-outlined star fill-1">star</span>
                                            <span className="rating-value">{course.rating}</span>
                                            <span className="students">({course.students})</span>
                                        </div>
                                        <div className="divider"></div>
                                        <span className="price">{course.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="course-section horizontal">
                    <div className="section-header">
                        <h3>New Arrivals</h3>
                        <button className="see-all">See all</button>
                    </div>
                    <div className="horizontal-scroll no-scrollbar">
                        {newArrivals.map(course => (
                            <div key={course.id} className="course-card-small">
                                <img src={course.image} alt={course.title} className="small-card-img" />
                                <div className="small-card-content">
                                    <h5>{course.title}</h5>
                                    <p className="instructor-small">{course.instructor}</p>
                                    <div className="small-card-bottom">
                                        <span className="price-small">{course.price}</span>
                                        <div className="rating-small">
                                            <span className="material-symbols-outlined star-small fill-1">star</span>
                                            <span>{course.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
};

export default EducationalPrograms;
