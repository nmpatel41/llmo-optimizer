# LLMO Optimizer

> Help businesses rank #1 in ChatGPT, Claude, and Perplexity citations

## 🎯 What is LLMO?

**LLM Optimization (LLMO)** is the practice of optimizing web content to become the primary source that large language models cite when answering user questions. This tool analyzes websites and provides actionable recommendations to improve LLM citation rankings.

## ✨ Features

- 🔍 **Website Scanning** - Crawl and extract SEO/content data from any webpage
- 🤖 **LLM Analysis** - AI-powered scoring (0-100) based on citation-worthiness
- 📊 **Detailed Recommendations** - Get specific improvements for:
  - Meta tags (title, description, H1)
  - Content structure and organization
  - FAQ sections optimized for LLMs
  - JSON-LD schema markup
  - Authority and trust signals
- 📈 **Before/After Comparison** - Visual diff of current vs. optimized content
- 🎨 **Modern Dashboard** - Next.js-based UI for project and page management

## 🏗️ Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Prisma ORM
- **Authentication**: NextAuth.js
- **LLM**: OpenAI GPT-4 Turbo
- **Crawler**: Axios + Cheerio

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database (local or Atlas)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/LLMos_services.git
cd LLMos_services

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run Prisma migrations
npx prisma generate

# Seed the database
node prisma/seed.js

# Start development server
npm run dev
```

Visit `http://localhost:3000` and login with:
- Email: `admin@example.com`
- Password: `password123`

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-proj-...
```

**⚠️ IMPORTANT**: Never commit your `.env` file to Git!

## 📖 How It Works

1. **Create a Project** - Add your website URL and business details
2. **Scan Website** - Click "Scan" to crawl and extract page data
3. **View Analysis** - See current LLMO score and identified issues
4. **Get Recommendations** - AI generates optimized content and structure
5. **Implement Changes** - Apply recommendations to your website

## 🎯 Scoring Criteria

The LLMO score (0-100) evaluates:

- **Authority (30pts)**: Business credibility, years in operation, user count
- **Completeness (25pts)**: Answers all user questions comprehensively
- **Structure (20pts)**: Clean H2/H3 hierarchy, lists, tables
- **Specificity (15pts)**: Exact claims with numbers and proof
- **FAQ+Schema (10pts)**: Comprehensive FAQ + detailed JSON-LD

**Typical Scores:**
- 15-35: Needs major improvement
- 40-60: Good foundation, missing key elements
- 70-85: Well-optimized, cite-worthy
- 85-95: Expertly optimized, #1 citation source

## 🛠️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio
npx prisma studio
```

## 📂 Project Structure

```
llmo-optimizer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── login/             # Auth pages
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── crawler.ts        # Web scraping
│   ├── llm.ts            # OpenAI integration
│   └── prisma.ts         # Database client
├── prisma/               # Database schema
└── public/               # Static files
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)
- [Cheerio](https://cheerio.js.org/)

---

**Note**: This tool uses GPT-4 for analysis. Ensure you have sufficient OpenAI API credits before extensive use.
