# Pagante - Democratic Creator Platform

![Pagante Logo](https://via.placeholder.com/200x80/FFD700/1E1B4B?text=PAGANTE)

**The first creator platform with democratic governance, where creators have real power through elected representation and fair dispute resolution.**

## 🌟 Overview

Pagante revolutionizes the creator economy by implementing a three-branch democratic governance system inspired by modern democratic principles. Unlike traditional creator platforms where decisions are made unilaterally by corporate executives, Pagante gives creators and users a real voice in platform governance through:

- **Democratic Elections** - Creators run for office and users vote for representatives
- **Legislative Branch** - Elected creators propose and vote on platform policies
- **Judicial Branch** - Independent judges resolve disputes fairly and transparently
- **Executive Branch** - Platform leadership implements approved policies

## ✨ Key Features

### 🗳️ Democratic Governance
- **Creator Elections**: Regular elections where creators campaign for legislative seats
- **Policy Proposals**: Elected representatives propose changes to revenue sharing, creator rights, and platform features
- **Transparent Voting**: All governance votes are public and trackable
- **Fair Representation**: Different creator categories have proportional representation

### ⚖️ Independent Judicial System
- **Dispute Resolution**: Fair resolution of conflicts between creators and users
- **Independent Judges**: Legal experts not employed by the platform
- **Transparent Process**: All case proceedings and decisions are documented
- **Appeal System**: Multi-level review process for complex cases

### 💰 Creator-First Economics
- **Fair Revenue Sharing**: Democratically determined platform fees
- **Multiple Monetization**: Subscriptions, tips, exclusive content, live streams
- **RevenueCat Integration**: Secure, reliable subscription management
- **Transparent Earnings**: Clear breakdown of all fees and earnings

### 🎨 Rich Content Platform
- **Multiple Content Types**: Text, images, videos, audio, live streams, polls, discussions
- **Subscription Tiers**: Free, Supporter, Premium, and VIP levels
- **Scheduled Publishing**: Plan and automate content releases
- **Community Features**: Comments, likes, shares, and discussions

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for beautiful, responsive design
- **Vite** for fast development and building
- **React Router** for client-side routing
- **Lucide React** for consistent iconography

### Backend & Database
- **Supabase** for authentication, database, and real-time features
- **PostgreSQL** with Row Level Security (RLS)
- **RESTful API** with automatic OpenAPI documentation

### Payments & Subscriptions
- **RevenueCat** for subscription management and analytics
- **Secure Payment Processing** with multiple payment methods
- **Webhook Integration** for real-time subscription updates

### Development Tools
- **TypeScript** for type safety and better developer experience
- **ESLint** for code quality and consistency
- **PostCSS** with Autoprefixer for CSS processing

## 🎨 Design System

### Color Palette
- **Primary Yellow**: `#FFD700` - Represents optimism, creativity, and prosperity
- **Royal Blue**: `#4169E1` - Conveys trust, stability, and professionalism
- **Supporting Colors**: Gold accents, navy for contrast, and semantic colors for status

### Typography
- **Font Family**: Inter - Clean, modern, and highly readable
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Responsive Scaling**: Fluid typography that scales with screen size

### Components
- **Consistent Spacing**: 8px grid system for perfect alignment
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Accessibility**: WCAG 2.1 AA compliant color contrasts and keyboard navigation

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- RevenueCat account (optional, for subscriptions)

### Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# RevenueCat Configuration
VITE_REVENUECAT_API_KEY=your_revenuecat_api_key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pagante-platform.git
   cd pagante-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Copy your project URL and anon key to `.env`

4. **Set up RevenueCat (Optional)**
   - Create a RevenueCat account
   - Set up your app and products
   - Copy your API key to `.env`

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User accounts and roles
- **creators** - Creator-specific information and election data
- **content** - All content posts with metadata
- **subscription_tiers** - Creator subscription offerings
- **subscriptions** - User subscriptions to creators

### Governance Tables
- **proposals** - Platform policy proposals
- **votes** - Voting records for proposals
- **elections** - Creator election votes
- **disputes** - Dispute cases and resolutions

### Engagement Tables
- **comments** - Content comments and replies
- **content_likes** - Content engagement tracking
- **content_access** - Content view analytics

## 🔐 Security & Privacy

### Authentication
- **Supabase Auth** with email/password and social providers
- **Row Level Security (RLS)** for data protection
- **JWT Tokens** for secure API access
- **Session Management** with automatic expiration

### Data Protection
- **GDPR Compliant** data handling
- **Encrypted Storage** for sensitive information
- **Audit Logs** for all governance actions
- **Privacy Controls** for user data

## 🎯 User Roles & Permissions

### User Roles
- **User**: Basic platform access, can vote in elections
- **Creator**: Can create content and run for office
- **Elected Creator**: Legislative branch member with voting rights
- **Judge**: Judicial branch member for dispute resolution
- **Admin**: Platform administration and oversight

### Permission Matrix
| Action | User | Creator | Elected | Judge | Admin |
|--------|------|---------|---------|-------|-------|
| Create Content | ❌ | ✅ | ✅ | ❌ | ✅ |
| Vote in Elections | ✅ | ✅ | ✅ | ❌ | ✅ |
| Propose Policies | ❌ | ❌ | ✅ | ❌ | ✅ |
| Resolve Disputes | ❌ | ❌ | ❌ | ✅ | ✅ |
| Platform Settings | ❌ | ❌ | ❌ | ❌ | ✅ |

## 📊 Analytics & Metrics

### Creator Analytics
- **Revenue Tracking**: Detailed earnings breakdown
- **Audience Insights**: Subscriber demographics and engagement
- **Content Performance**: Views, likes, comments, and shares
- **Growth Metrics**: Follower growth and retention rates

### Platform Metrics
- **Governance Participation**: Voting rates and proposal activity
- **Dispute Resolution**: Case resolution times and satisfaction
- **Creator Success**: Revenue distribution and creator retention
- **User Engagement**: Platform usage and community health

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy with automatic builds on push

### Manual Deployment
```bash
# Build the project
npm run build

# Deploy the dist/ folder to your hosting provider
```

### Environment Configuration
- **Development**: Uses Supabase local development
- **Staging**: Separate Supabase project for testing
- **Production**: Production Supabase project with backups

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Pull request process
- Issue reporting
- Feature requests

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Documentation**: Available at `/docs` when running locally
- **Component Storybook**: Interactive component documentation
- **Database Schema**: Detailed schema documentation in `/docs/database`

### Community Support
- **Discord Server**: Join our community for real-time help
- **GitHub Issues**: Report bugs and request features
- **Email Support**: contact@pagante.com for urgent issues

### Professional Support
- **Enterprise Support**: Available for large deployments
- **Custom Development**: Tailored features and integrations
- **Training & Consulting**: Platform setup and optimization

## 🗺️ Roadmap

### Q1 2024
- ✅ Core platform development
- ✅ Democratic governance system
- ✅ Basic content creation tools
- ✅ Subscription management

### Q2 2024
- 🔄 Mobile app development
- 🔄 Advanced analytics dashboard
- 🔄 Live streaming features
- 🔄 API for third-party integrations

### Q3 2024
- 📅 Creator marketplace
- 📅 Advanced moderation tools
- 📅 Multi-language support
- 📅 Creator collaboration features

### Q4 2024
- 📅 AI-powered content recommendations
- 📅 Advanced dispute resolution tools
- 📅 Creator education platform
- 📅 Global expansion features

## 📈 Success Metrics

### Platform Health
- **Creator Retention**: 85%+ monthly active creators
- **User Engagement**: 70%+ monthly active users
- **Revenue Growth**: 25%+ quarter-over-quarter
- **Dispute Resolution**: <48 hour average resolution time

### Democratic Participation
- **Election Turnout**: 60%+ creator participation
- **Proposal Engagement**: 40%+ user voting on proposals
- **Governance Satisfaction**: 80%+ creator satisfaction with governance

## 🌍 Vision & Mission

### Mission
To democratize the creator economy by giving creators and users real power in platform governance, ensuring fair treatment, transparent operations, and sustainable growth for all participants.

### Vision
A world where creator platforms are owned and governed by their communities, where creators have economic security and creative freedom, and where users have a voice in the platforms they support.

### Values
- **Democracy**: Every voice matters in platform decisions
- **Transparency**: Open governance and clear communication
- **Fairness**: Equal treatment and opportunity for all creators
- **Innovation**: Continuous improvement and feature development
- **Community**: Building strong, supportive creator communities

---

**Built with ❤️ by the Pagante team**

*Empowering creators through democratic governance*