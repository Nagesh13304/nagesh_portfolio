from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from decouple import config

import json

from django.shortcuts import render
from django.http import JsonResponse
from .models import ContactMessage  # Make sure to import your model

from django.http import JsonResponse
from .models import ContactMessage




def index(request):
    """Main portfolio page view"""
    if request.method == 'POST':
        try:
            name = request.POST.get('name')
            email = request.POST.get('email')
            subject = request.POST.get('subject')
            message = request.POST.get('message')
            rating = request.POST.get('rating')  # ⭐ Get star rating

            # Save to DB
            ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message,
                rating=int(rating) if rating else None
            )

            print(f"Contact form from {name} ({email}) | Rating: {rating}")

            # Send email
            send_mail(
                subject=f"{name} watched your portfolio: {subject}",
                message=f"Name: {name}\nEmail: {email}\nMessage:\n{message}\nRating: {rating}",
                from_email=config('EMAIL_HOST_USER'),
                recipient_list=[config('EMAIL_HOST_USER')],
                fail_silently=False,
            )

            # AJAX response
            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'success',
                    'message': 'Message sent successfully!'
                })

            # Normal POST response
            return render(request, 'index.html', {
                'success_message': "Thank you for your message! I'll get back to you soon."
            })

        except Exception as e:
            print(f"Error processing contact form: {e}")

            if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return JsonResponse({
                    'status': 'error',
                    'message': 'Failed to send message'
                }, status=500)

            return render(request, 'index.html', {
                'error_message': 'Sorry, something went wrong. Please try again.'
            })

    # GET request
    context = {
        'name': 'Nagesh Swamy',
        'title': 'Full Stack Developer & Data Analyst',
        'email': 'nagesh13304@gmail.com',
        'phone': '+91 7892532949',
        'github': 'https://github.com/Nagesh13304',
        'linkedin': 'https://www.linkedin.com/in/nagesh-swamy',
    }

    return render(request, 'index.html', context)






def messages_view(request):
    messages = ContactMessage.objects.all().order_by('-created_at')  # latest first
    context = {
        'messages': messages
    }
    return render(request, 'messages.html', context)

def about(request):
    """About page API endpoint (optional)"""
    data = {
        'name': 'Nagesh Swamy',
        'education': 'B.E. in Computer Science & Engineering',
        'university': 'Vivekananda Institute of Technology, Bangalore',
        'year': '2025',
        'languages': ['Kannada', 'English', 'Hindi', 'Marathi'],
        'interests': ['Chess', 'Online Gaming (Free Fire)']
    }
    return JsonResponse(data)

def skills(request):
    """Skills API endpoint (optional)"""
    data = {
        'programming': ['Python', 'SQL', 'Pandas', 'NumPy'],
        'web': ['HTML', 'CSS', 'JavaScript', 'Django'],
        'ml_ds': ['scikit-learn', 'NLP', 'TensorFlow'],
        'visualization': ['Pandas', 'Matplotlib', 'Seaborn', 'Power BI']
    }
    return JsonResponse(data)

def projects(request):
    """Projects API endpoint (optional)"""
    data = {
        'projects': [
            {
                'name': 'E-Commerce Website',
                'description': 'Responsive e-commerce website with product listings, add-to-cart, search functionality',
                'technologies': ['HTML', 'CSS', 'JavaScript'],
                'github': 'https://github.com/Nagesh13304',
                'live': '#'
            },
            {
                'name': 'Resume Screening System',
                'description': 'NLP and ML-based system to shortlist candidates efficiently',
                'technologies': ['Python', 'NLP', 'ML'],
                'github': 'https://github.com/Nagesh13304'
            },
            {
                'name': 'Fake News Detection',
                'description': 'Machine learning model for detecting fake news',
                'technologies': ['Python', 'ML', 'NLP'],
                'github': 'https://github.com/Nagesh13304'
            },
            {
                'name': 'Stock Price Prediction',
                'description': 'ML regression model to predict stock prices',
                'technologies': ['Python', 'ML', 'Time-Series'],
                'github': 'https://github.com/Nagesh13304'
            },
            {
                'name': 'Netflix Recommendation System',
                'description': 'Content-based recommendation system using cosine similarity',
                'technologies': ['Python', 'ML', 'Recommendation'],
                'github': 'https://github.com/Nagesh13304'
            },
            {
                'name': 'Bike Store Dashboard',
                'description': 'Power BI dashboard for revenue trends and sales insights',
                'technologies': ['Power BI', 'DAX', 'Data Viz'],
                'github': 'https://github.com/Nagesh13304'
            },
            {
                 'name': 'Personal Portfolio Website',
                 'description': 'Django-based personal portfolio to showcase projects, skills, and contact information',
                 'technologies': ['Django', 'Python', 'HTML', 'CSS', 'Bootstrap', 'Font Awesome'],
                 'github': 'https://github.com/Nagesh13304/nagesh_portfolio'
            }

        ]
    }
    return JsonResponse(data)

def experience(request):
    """Experience API endpoint (optional)"""
    data = {
        'experience': [
            {
                'title': 'Web Development Intern',
                'company': 'PySpider',
                'period': 'Aug 2025 – Oct 2025',
                'responsibilities': [
                    'Developed a functional e-commerce website with product listings, cart, and checkout',
                    'Built responsive and user-friendly UI using HTML, CSS, JavaScript'
                ]
            },
            {
                'title': 'Data Science Intern',
                'company': 'Unified Mentor',
                'period': 'Sept 2024 – Jan 2025',
                'responsibilities': [
                    'Performed EDA using Python (Pandas, Matplotlib, Seaborn)',
                    'Built a Fake News Detection model using ML techniques'
                ]
            },
            {
                'title': 'AI & Machine Learning Intern',
                'company': 'Rooman Technologies',
                'period': 'Jan 2024 – Apr 2024',
                'responsibilities': [
                    'Implemented ML algorithms including Linear Regression, Decision Trees, K-Means',
                    'Built NLP-based Resume Screening model to classify resume job fields'
                ]
            },
            {
                'title': 'Full Stack Intern',
                'company': 'DevMinds',
                'period': 'Oct 2023 – Nov 2023',
                'responsibilities': [
                    'Built full-stack applications using Python, Django, HTML, CSS, JavaScript',
                    'Created interactive web pages and backend APIs using the Django framework'
                ]
            }
        ]
    }
    return JsonResponse(data)


def contact_view(request):
    if request.method == "POST":
        ContactMessage.objects.create(
            name=request.POST.get("name"),
            email=request.POST.get("email"),
            subject=request.POST.get("subject"),
            message=request.POST.get("message"),
            rating=request.POST.get("rating")  # ⭐ saves 1–5
        )
