# Stream Sage 🎬

**Stream Sage** is an intelligent media tracking and discovery platform. It combines a modern web interface with a dedicated AI microservice to provide personalized movie and series recommendations based on semantic similarity.

## 🚀 Features

* **AI-Powered Recommendations:** Uses Natural Language Processing (NLP) to understand movie plot summaries and find semantically similar content.
* **Media Tracking:** Keep track of movies and series you want to watch or have watched.
* **Modern UI:** A responsive and accessible user interface built with **shadcn/ui** and Tailwind CSS.
* **Secure Authentication:** User management and data persistence powered by Supabase.

## 🛠️ Tech Stack

### **Frontend (`/web`)**
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **UI Library:** [shadcn/ui](https://ui.shadcn.com/) (built on Radix Primitives)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Backend-as-a-Service:** [Supabase](https://supabase.com/) (Auth & Database)

### **AI Microservice (`/ai-service`)**
* **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
* **ML Model:** `all-MiniLM-L6-v2` via [SentenceTransformers](https://www.sbert.net/)
* **Vector Search:** Scikit-learn (Cosine Similarity)
* **Data Processing:** Pandas & NumPy

---

## 📂 Project Structure

```bash
stream-sage/
├── ai-service/        # Python backend for AI recommendations
│   ├── main.py        # FastAPI application entry point
│   ├── movies.csv     # Dataset for movie metadata
│   └── requirements.txt
├── web/               # Next.js frontend application
│   ├── app/           # App Router pages and layouts
│   ├── components/    # UI components (shadcn/ui)
│   └── package.json
└── README.md