import { supabase } from './supabase'

// Fake data for presentation purposes
export const createFakeData = async () => {
  console.log('Creating fake data for presentation...')

  try {
    // 1. Create fake users/profiles
    const fakeProfiles = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'sarah.chen@example.com',
        username: 'sarahcreates',
        full_name: 'Sarah Chen',
        role: 'elected_creator',
        avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'marcus.williams@example.com',
        username: 'techmarco',
        full_name: 'Marcus Williams',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'luna.rodriguez@example.com',
        username: 'lunamusic',
        full_name: 'Luna Rodriguez',
        role: 'elected_creator',
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'david.park@example.com',
        username: 'davidwrites',
        full_name: 'David Park',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'judge.smith@example.com',
        username: 'judgesmithlaw',
        full_name: 'Judge Emily Smith',
        role: 'judge',
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        email: 'admin@pagante.com',
        username: 'pagante_admin',
        full_name: 'Platform Admin',
        role: 'admin',
        avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ]

    // Insert profiles (skip if they exist)
    for (const profile of fakeProfiles) {
      const { error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
      
      if (error) {
        console.log(`Profile ${profile.username} might already exist:`, error.message)
      }
    }

    // 2. Create creators
    const fakeCreators = [
      {
        id: 'creator-1111-1111-1111-111111111111',
        user_id: '11111111-1111-1111-1111-111111111111',
        description: 'Digital artist and UI/UX designer passionate about creating beautiful, accessible designs. Advocate for creator mental health and fair revenue sharing.',
        is_elected: true,
        election_votes: 1247,
        term_start_date: '2024-01-01T00:00:00Z',
        term_end_date: '2024-12-31T23:59:59Z'
      },
      {
        id: 'creator-2222-2222-2222-222222222222',
        user_id: '22222222-2222-2222-2222-222222222222',
        description: 'Tech educator and software developer. Creating tutorials, courses, and tools to help others learn programming and technology.',
        is_elected: false,
        election_votes: 1156
      },
      {
        id: 'creator-3333-3333-3333-333333333333',
        user_id: '33333333-3333-3333-3333-333333333333',
        description: 'Independent musician and audio producer. Champion for musicians\' rights and fair compensation in the digital age.',
        is_elected: true,
        election_votes: 1089,
        term_start_date: '2024-01-01T00:00:00Z',
        term_end_date: '2024-12-31T23:59:59Z'
      },
      {
        id: 'creator-4444-4444-4444-444444444444',
        user_id: '44444444-4444-4444-4444-444444444444',
        description: 'Writer and educator focused on making complex topics accessible. Promoting educational content and creator learning initiatives.',
        is_elected: false,
        election_votes: 987
      }
    ]

    for (const creator of fakeCreators) {
      const { error } = await supabase
        .from('creators')
        .upsert(creator, { onConflict: 'id' })
      
      if (error) {
        console.log(`Creator ${creator.id} might already exist:`, error.message)
      }
    }

    // 3. Create subscription tiers
    const fakeSubscriptionTiers = [
      // Sarah's tiers
      {
        id: 'tier-sarah-supporter',
        creator_id: 'creator-1111-1111-1111-111111111111',
        name: 'Design Supporter',
        description: 'Support my design work and get early access to tutorials',
        price_monthly: 5.00,
        tier_type: 'supporter',
        benefits: ['Early access to design tutorials', 'Monthly design resources pack', 'Community Discord access'],
        is_active: true
      },
      {
        id: 'tier-sarah-premium',
        creator_id: 'creator-1111-1111-1111-111111111111',
        name: 'Design Pro',
        description: 'Get premium design resources and 1-on-1 feedback',
        price_monthly: 15.00,
        tier_type: 'premium',
        benefits: ['Everything in Supporter', 'Monthly 1-on-1 design review', 'Premium design templates', 'Portfolio feedback'],
        is_active: true
      },
      // Marcus's tiers
      {
        id: 'tier-marcus-supporter',
        creator_id: 'creator-2222-2222-2222-222222222222',
        name: 'Code Supporter',
        description: 'Support my tech education content',
        price_monthly: 8.00,
        tier_type: 'supporter',
        benefits: ['Early access to tutorials', 'Source code for all projects', 'Monthly Q&A sessions'],
        is_active: true
      },
      {
        id: 'tier-marcus-premium',
        creator_id: 'creator-2222-2222-2222-222222222222',
        name: 'Tech Mentor',
        description: 'Get personalized mentoring and career guidance',
        price_monthly: 25.00,
        tier_type: 'premium',
        benefits: ['Everything in Supporter', 'Monthly 1-on-1 mentoring call', 'Resume/portfolio review', 'Career guidance'],
        is_active: true
      },
      // Luna's tiers
      {
        id: 'tier-luna-supporter',
        creator_id: 'creator-3333-3333-3333-333333333333',
        name: 'Music Lover',
        description: 'Support independent music and get exclusive content',
        price_monthly: 10.00,
        tier_type: 'supporter',
        benefits: ['Early access to new songs', 'Behind-the-scenes content', 'Monthly acoustic sessions'],
        is_active: true
      },
      {
        id: 'tier-luna-vip',
        creator_id: 'creator-3333-3333-3333-333333333333',
        name: 'VIP Music Fan',
        description: 'Ultimate music experience with exclusive perks',
        price_monthly: 50.00,
        tier_type: 'vip',
        benefits: ['Everything in Music Lover', 'Exclusive unreleased tracks', 'Virtual concert access', 'Signed merchandise'],
        is_active: true
      }
    ]

    for (const tier of fakeSubscriptionTiers) {
      const { error } = await supabase
        .from('subscription_tiers')
        .upsert(tier, { onConflict: 'id' })
      
      if (error) {
        console.log(`Subscription tier ${tier.id} might already exist:`, error.message)
      }
    }

    // 4. Create diverse content
    const fakeContent = [
      // Sarah's content
      {
        id: 'content-sarah-1',
        creator_id: 'creator-1111-1111-1111-111111111111',
        title: 'The Future of UI Design: Trends for 2024',
        description: 'Exploring the latest trends in user interface design and what they mean for creators.',
        content_type: 'article',
        content_data: {
          text: 'As we move into 2024, UI design continues to evolve at a rapid pace. Here are the key trends I\'m seeing:\n\n1. **Neumorphism Evolution**: The soft, tactile design trend is maturing with better accessibility considerations.\n\n2. **AI-Assisted Design**: Tools are becoming more sophisticated, but human creativity remains irreplaceable.\n\n3. **Sustainable Design**: Eco-conscious design choices are becoming mainstream.\n\n4. **Inclusive Design**: Accessibility is no longer an afterthought but a core principle.\n\nWhat trends are you most excited about? Let me know in the comments!'
        },
        tier_required: 'free',
        is_published: true,
        view_count: 1247,
        like_count: 89,
        comment_count: 23,
        tags: ['design', 'ui', 'trends', '2024'],
        created_at: '2024-06-20T10:00:00Z'
      },
      {
        id: 'content-sarah-2',
        creator_id: 'creator-1111-1111-1111-111111111111',
        title: 'Design System Masterclass',
        description: 'Complete guide to building scalable design systems',
        content_type: 'video',
        content_data: {
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 1800
        },
        tier_required: 'supporter',
        is_published: true,
        view_count: 567,
        like_count: 45,
        comment_count: 12,
        tags: ['design-system', 'tutorial', 'advanced'],
        created_at: '2024-06-19T14:30:00Z'
      },
      {
        id: 'content-sarah-3',
        creator_id: 'creator-1111-1111-1111-111111111111',
        title: 'What\'s your biggest design challenge?',
        description: 'Let\'s discuss the challenges we face as designers',
        content_type: 'poll',
        content_data: {
          question: 'What\'s your biggest challenge as a designer in 2024?',
          options: ['Keeping up with trends', 'Client communication', 'Technical constraints', 'Time management', 'Staying creative'],
          multiple_choice: false
        },
        tier_required: 'free',
        is_published: true,
        view_count: 892,
        like_count: 67,
        comment_count: 34,
        tags: ['community', 'discussion', 'challenges'],
        created_at: '2024-06-18T09:15:00Z'
      },
      // Marcus's content
      {
        id: 'content-marcus-1',
        creator_id: 'creator-2222-2222-2222-222222222222',
        title: 'Building Your First React App',
        description: 'Step-by-step tutorial for React beginners',
        content_type: 'video',
        content_data: {
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 2400
        },
        tier_required: 'free',
        is_published: true,
        view_count: 2341,
        like_count: 156,
        comment_count: 45,
        tags: ['react', 'tutorial', 'beginner', 'javascript'],
        created_at: '2024-06-21T16:00:00Z'
      },
      {
        id: 'content-marcus-2',
        creator_id: 'creator-2222-2222-2222-222222222222',
        title: 'Advanced TypeScript Patterns',
        description: 'Deep dive into advanced TypeScript techniques',
        content_type: 'article',
        content_data: {
          text: 'TypeScript has become essential for modern web development. Here are some advanced patterns that will level up your code:\n\n## 1. Conditional Types\n\nConditional types allow you to create types that depend on a condition:\n\n```typescript\ntype ApiResponse<T> = T extends string ? string : T extends number ? number : never;\n```\n\n## 2. Mapped Types\n\nCreate new types by transforming properties of existing types:\n\n```typescript\ntype Partial<T> = {\n  [P in keyof T]?: T[P];\n};\n```\n\n## 3. Template Literal Types\n\nBuild types using template literal syntax:\n\n```typescript\ntype EventName<T extends string> = `on${Capitalize<T>}`;\n```\n\nThese patterns will help you write more type-safe and maintainable code!'
        },
        tier_required: 'supporter',
        is_published: true,
        view_count: 1123,
        like_count: 78,
        comment_count: 19,
        tags: ['typescript', 'advanced', 'patterns', 'programming'],
        created_at: '2024-06-20T11:30:00Z'
      },
      // Luna's content
      {
        id: 'content-luna-1',
        creator_id: 'creator-3333-3333-3333-333333333333',
        title: 'Midnight Dreams - New Single',
        description: 'My latest single exploring themes of hope and resilience',
        content_type: 'audio',
        content_data: {
          audio_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          duration: 240,
          file_name: 'midnight-dreams.mp3',
          file_size: 5242880
        },
        tier_required: 'supporter',
        is_published: true,
        view_count: 1876,
        like_count: 234,
        comment_count: 67,
        tags: ['music', 'single', 'indie', 'original'],
        created_at: '2024-06-22T20:00:00Z'
      },
      {
        id: 'content-luna-2',
        creator_id: 'creator-3333-3333-3333-333333333333',
        title: 'Behind the Music: Studio Session',
        description: 'Take a look behind the scenes of my recording process',
        content_type: 'image',
        content_data: {
          image_url: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
          alt_text: 'Luna in the recording studio with guitar and microphone',
          file_name: 'studio-session.jpg',
          file_size: 1048576
        },
        tier_required: 'free',
        is_published: true,
        view_count: 945,
        like_count: 123,
        comment_count: 28,
        tags: ['behind-the-scenes', 'studio', 'music-production'],
        created_at: '2024-06-21T15:45:00Z'
      },
      // David's content
      {
        id: 'content-david-1',
        creator_id: 'creator-4444-4444-4444-444444444444',
        title: 'The Art of Technical Writing',
        description: 'How to make complex topics accessible to everyone',
        content_type: 'article',
        content_data: {
          text: 'Technical writing is both an art and a science. Here\'s how to master it:\n\n## Know Your Audience\n\nBefore you write a single word, understand who you\'re writing for. Are they beginners or experts? What\'s their background?\n\n## Use Clear Structure\n\n1. Start with the big picture\n2. Break down complex concepts\n3. Use examples and analogies\n4. Provide actionable takeaways\n\n## Write Like You Speak\n\nAvoid jargon when possible. If you must use technical terms, define them clearly.\n\n## Test Your Content\n\nHave someone from your target audience read your draft. Their feedback is invaluable.\n\nRemember: the goal is understanding, not showing off your vocabulary!'
        },
        tier_required: 'free',
        is_published: true,
        view_count: 1567,
        like_count: 89,
        comment_count: 31,
        tags: ['writing', 'education', 'communication', 'tips'],
        created_at: '2024-06-19T13:20:00Z'
      }
    ]

    for (const content of fakeContent) {
      const { error } = await supabase
        .from('content')
        .upsert(content, { onConflict: 'id' })
      
      if (error) {
        console.log(`Content ${content.id} might already exist:`, error.message)
      }
    }

    // 5. Create proposals for governance
    const fakeProposals = [
      {
        id: 'proposal-1',
        creator_id: 'creator-1111-1111-1111-111111111111',
        title: 'Reduce Platform Fee to 8%',
        description: 'Proposal to reduce the platform fee from 10% to 8% to better support creators, especially those just starting out. This would increase creator earnings while maintaining platform sustainability.',
        proposal_type: 'revenue_sharing',
        status: 'voting',
        votes_for: 1247,
        votes_against: 234,
        voting_deadline: '2024-07-01T23:59:59Z',
        created_at: '2024-06-15T10:00:00Z'
      },
      {
        id: 'proposal-2',
        creator_id: 'creator-3333-3333-3333-333333333333',
        title: 'Creator Mental Health Support Program',
        description: 'Establish a mental health support program for creators, including access to counseling services, stress management resources, and community support groups.',
        proposal_type: 'creator_rights',
        status: 'voting',
        votes_for: 1876,
        votes_against: 123,
        voting_deadline: '2024-06-30T23:59:59Z',
        created_at: '2024-06-10T14:30:00Z'
      },
      {
        id: 'proposal-3',
        creator_id: 'creator-1111-1111-1111-111111111111',
        title: 'Enhanced Content Moderation Tools',
        description: 'Implement AI-assisted content moderation tools while maintaining human oversight to ensure fair and consistent policy enforcement.',
        proposal_type: 'platform_policy',
        status: 'passed',
        votes_for: 2341,
        votes_against: 456,
        voting_deadline: '2024-06-20T23:59:59Z',
        created_at: '2024-06-05T09:15:00Z'
      }
    ]

    for (const proposal of fakeProposals) {
      const { error } = await supabase
        .from('proposals')
        .upsert(proposal, { onConflict: 'id' })
      
      if (error) {
        console.log(`Proposal ${proposal.id} might already exist:`, error.message)
      }
    }

    // 6. Create some disputes for the judicial system
    const fakeDisputes = [
      {
        id: 'dispute-1',
        plaintiff_id: '22222222-2222-2222-2222-222222222222',
        defendant_id: '44444444-4444-4444-4444-444444444444',
        title: 'Copyright Infringement Claim',
        description: 'Claim that content was used without permission in a tutorial video. Seeking resolution and proper attribution.',
        status: 'under_review',
        assigned_judge_id: '55555555-5555-5555-5555-555555555555',
        created_at: '2024-06-18T11:00:00Z'
      },
      {
        id: 'dispute-2',
        plaintiff_id: '33333333-3333-3333-3333-333333333333',
        defendant_id: '22222222-2222-2222-2222-222222222222',
        title: 'Revenue Sharing Dispute',
        description: 'Disagreement over collaboration revenue split for a joint project. Seeking fair resolution based on contribution.',
        status: 'resolved',
        assigned_judge_id: '55555555-5555-5555-5555-555555555555',
        resolution: 'Revenue split adjusted to 60/40 based on documented contributions and time invested.',
        created_at: '2024-06-10T15:30:00Z',
        resolved_at: '2024-06-20T10:15:00Z'
      }
    ]

    for (const dispute of fakeDisputes) {
      const { error } = await supabase
        .from('disputes')
        .upsert(dispute, { onConflict: 'id' })
      
      if (error) {
        console.log(`Dispute ${dispute.id} might already exist:`, error.message)
      }
    }

    // 7. Create some votes on proposals
    const fakeVotes = [
      { user_id: '22222222-2222-2222-2222-222222222222', proposal_id: 'proposal-1', vote_type: 'for' },
      { user_id: '33333333-3333-3333-3333-333333333333', proposal_id: 'proposal-1', vote_type: 'for' },
      { user_id: '44444444-4444-4444-4444-444444444444', proposal_id: 'proposal-1', vote_type: 'against' },
      { user_id: '11111111-1111-1111-1111-111111111111', proposal_id: 'proposal-2', vote_type: 'for' },
      { user_id: '22222222-2222-2222-2222-222222222222', proposal_id: 'proposal-2', vote_type: 'for' },
      { user_id: '44444444-4444-4444-4444-444444444444', proposal_id: 'proposal-2', vote_type: 'for' }
    ]

    for (const vote of fakeVotes) {
      const { error } = await supabase
        .from('votes')
        .insert(vote)
      
      if (error && !error.message.includes('duplicate')) {
        console.log(`Vote might already exist:`, error.message)
      }
    }

    // 8. Create election votes
    const fakeElections = [
      { candidate_id: 'creator-1111-1111-1111-111111111111', voter_id: '22222222-2222-2222-2222-222222222222' },
      { candidate_id: 'creator-1111-1111-1111-111111111111', voter_id: '44444444-4444-4444-4444-444444444444' },
      { candidate_id: 'creator-3333-3333-3333-333333333333', voter_id: '11111111-1111-1111-1111-111111111111' },
      { candidate_id: 'creator-3333-3333-3333-333333333333', voter_id: '22222222-2222-2222-2222-222222222222' }
    ]

    for (const election of fakeElections) {
      const { error } = await supabase
        .from('elections')
        .insert(election)
      
      if (error && !error.message.includes('duplicate')) {
        console.log(`Election vote might already exist:`, error.message)
      }
    }

    // 9. Create some comments
    const fakeComments = [
      {
        content_id: 'content-sarah-1',
        user_id: '22222222-2222-2222-2222-222222222222',
        comment_text: 'Great insights on UI trends! The point about sustainable design really resonates with me.',
        like_count: 12
      },
      {
        content_id: 'content-sarah-1',
        user_id: '33333333-3333-3333-3333-333333333333',
        comment_text: 'Love the focus on accessibility. It\'s about time this became a priority!',
        like_count: 8
      },
      {
        content_id: 'content-marcus-1',
        user_id: '11111111-1111-1111-1111-111111111111',
        comment_text: 'Perfect tutorial for beginners! Your explanation style is so clear.',
        like_count: 15
      },
      {
        content_id: 'content-luna-1',
        user_id: '44444444-4444-4444-4444-444444444444',
        comment_text: 'This song is absolutely beautiful! The lyrics really speak to me.',
        like_count: 23
      }
    ]

    for (const comment of fakeComments) {
      const { error } = await supabase
        .from('comments')
        .insert(comment)
      
      if (error) {
        console.log(`Comment might already exist:`, error.message)
      }
    }

    // 10. Create some content likes
    const fakeContentLikes = [
      { content_id: 'content-sarah-1', user_id: '22222222-2222-2222-2222-222222222222' },
      { content_id: 'content-sarah-1', user_id: '33333333-3333-3333-3333-333333333333' },
      { content_id: 'content-sarah-1', user_id: '44444444-4444-4444-4444-444444444444' },
      { content_id: 'content-marcus-1', user_id: '11111111-1111-1111-1111-111111111111' },
      { content_id: 'content-marcus-1', user_id: '33333333-3333-3333-3333-333333333333' },
      { content_id: 'content-luna-1', user_id: '11111111-1111-1111-1111-111111111111' },
      { content_id: 'content-luna-1', user_id: '22222222-2222-2222-2222-222222222222' },
      { content_id: 'content-luna-1', user_id: '44444444-4444-4444-4444-444444444444' }
    ]

    for (const like of fakeContentLikes) {
      const { error } = await supabase
        .from('content_likes')
        .insert(like)
      
      if (error && !error.message.includes('duplicate')) {
        console.log(`Content like might already exist:`, error.message)
      }
    }

    // 11. Create some subscriptions
    const fakeSubscriptions = [
      {
        user_id: '22222222-2222-2222-2222-222222222222',
        creator_id: 'creator-1111-1111-1111-111111111111',
        tier_id: 'tier-sarah-supporter',
        status: 'active'
      },
      {
        user_id: '44444444-4444-4444-4444-444444444444',
        creator_id: 'creator-3333-3333-3333-333333333333',
        tier_id: 'tier-luna-supporter',
        status: 'active'
      },
      {
        user_id: '11111111-1111-1111-1111-111111111111',
        creator_id: 'creator-2222-2222-2222-222222222222',
        tier_id: 'tier-marcus-premium',
        status: 'active'
      }
    ]

    for (const subscription of fakeSubscriptions) {
      const { error } = await supabase
        .from('subscriptions')
        .insert(subscription)
      
      if (error && !error.message.includes('duplicate')) {
        console.log(`Subscription might already exist:`, error.message)
      }
    }

    // 12. Create some creator earnings
    const fakeEarnings = [
      {
        creator_id: 'creator-1111-1111-1111-111111111111',
        amount: 500.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 50.00,
        net_amount: 450.00,
        processed_at: '2024-06-01T00:00:00Z'
      },
      {
        creator_id: 'creator-2222-2222-2222-222222222222',
        amount: 750.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 75.00,
        net_amount: 675.00,
        processed_at: '2024-06-01T00:00:00Z'
      },
      {
        creator_id: 'creator-3333-3333-3333-333333333333',
        amount: 1200.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 120.00,
        net_amount: 1080.00,
        processed_at: '2024-06-01T00:00:00Z'
      }
    ]

    for (const earning of fakeEarnings) {
      const { error } = await supabase
        .from('creator_earnings')
        .insert(earning)
      
      if (error) {
        console.log(`Earning record might already exist:`, error.message)
      }
    }

    console.log('✅ Fake data creation completed!')
    return { success: true, message: 'All fake data has been created successfully!' }

  } catch (error) {
    console.error('Error creating fake data:', error)
    return { success: false, error: error.message }
  }
}

// Function to clear all fake data (for testing)
export const clearFakeData = async () => {
  console.log('Clearing fake data...')
  
  const tables = [
    'content_likes',
    'comments', 
    'creator_earnings',
    'subscriptions',
    'votes',
    'elections',
    'disputes',
    'proposals',
    'content',
    'subscription_tiers',
    'creators'
    // Note: We don't delete profiles as they might be real users
  ]

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all except impossible ID
      
      if (error) {
        console.log(`Error clearing ${table}:`, error.message)
      } else {
        console.log(`✅ Cleared ${table}`)
      }
    } catch (error) {
      console.log(`Error clearing ${table}:`, error)
    }
  }
  
  console.log('Fake data clearing completed!')
}