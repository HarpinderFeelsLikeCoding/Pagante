import { supabase } from './supabase'

// Enhanced fake data for presentation purposes
export const createFakeData = async () => {
  console.log('Creating comprehensive fake data for presentation...')

  try {
    // 1. Create extensive fake users/profiles for creators page
    const fakeProfiles = [
      // Elected Representatives
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'sarah.chen@example.com',
        username: 'sarahcreates',
        full_name: 'Sarah Chen',
        role: 'elected_creator',
        avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
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
        id: '77777777-7777-7777-7777-777777777777',
        email: 'alex.kim@example.com',
        username: 'alexcodes',
        full_name: 'Alex Kim',
        role: 'elected_creator',
        avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        email: 'maya.patel@example.com',
        username: 'mayaart',
        full_name: 'Maya Patel',
        role: 'elected_creator',
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      // Regular Creators
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'marcus.williams@example.com',
        username: 'techmarco',
        full_name: 'Marcus Williams',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
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
        id: '99999999-9999-9999-9999-999999999999',
        email: 'emma.johnson@example.com',
        username: 'emmacooks',
        full_name: 'Emma Johnson',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        email: 'james.wilson@example.com',
        username: 'jamesfitness',
        full_name: 'James Wilson',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        email: 'sophia.garcia@example.com',
        username: 'sophiaphoto',
        full_name: 'Sophia Garcia',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        email: 'ryan.thompson@example.com',
        username: 'ryangaming',
        full_name: 'Ryan Thompson',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        email: 'olivia.brown@example.com',
        username: 'oliviabeauty',
        full_name: 'Olivia Brown',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        email: 'noah.davis@example.com',
        username: 'noahtravel',
        full_name: 'Noah Davis',
        role: 'creator',
        avatar_url: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      // Judicial Branch
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'judge.smith@example.com',
        username: 'judgesmithlaw',
        full_name: 'Judge Emily Smith',
        role: 'judge',
        avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
        email: 'judge.martinez@example.com',
        username: 'judgemartinez',
        full_name: 'Judge Carlos Martinez',
        role: 'judge',
        avatar_url: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'gggggggg-gggg-gggg-gggg-gggggggggggg',
        email: 'judge.lee@example.com',
        username: 'judgelee',
        full_name: 'Judge Jennifer Lee',
        role: 'judge',
        avatar_url: 'https://images.pexels.com/photos/1181691/pexels-photo-1181691.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      // Platform Admin
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

    // 2. Create comprehensive creators data
    const fakeCreators = [
      // Elected Representatives
      {
        id: 'creator-1111-1111-1111-111111111111',
        user_id: '11111111-1111-1111-1111-111111111111',
        description: 'Digital artist and UI/UX designer passionate about creating beautiful, accessible designs. Advocate for creator mental health and fair revenue sharing. Leading the charge for better platform policies.',
        is_elected: true,
        election_votes: 2847,
        term_start_date: '2024-01-01T00:00:00Z',
        term_end_date: '2024-12-31T23:59:59Z'
      },
      {
        id: 'creator-3333-3333-3333-333333333333',
        user_id: '33333333-3333-3333-3333-333333333333',
        description: 'Independent musician and audio producer. Champion for musicians\' rights and fair compensation in the digital age. Fighting for better revenue sharing for audio creators.',
        is_elected: true,
        election_votes: 2456,
        term_start_date: '2024-01-01T00:00:00Z',
        term_end_date: '2024-12-31T23:59:59Z'
      },
      {
        id: 'creator-7777-7777-7777-777777777777',
        user_id: '77777777-7777-7777-7777-777777777777',
        description: 'Full-stack developer and coding instructor. Passionate about making technology education accessible to everyone. Advocating for better creator tools and platform transparency.',
        is_elected: true,
        election_votes: 2234,
        term_start_date: '2024-01-01T00:00:00Z',
        term_end_date: '2024-12-31T23:59:59Z'
      },
      {
        id: 'creator-8888-8888-8888-888888888888',
        user_id: '88888888-8888-8888-8888-888888888888',
        description: 'Contemporary artist and digital illustrator. Creating vibrant artwork that celebrates diversity and inclusion. Leading initiatives for artist rights and fair compensation.',
        is_elected: true,
        election_votes: 1987,
        term_start_date: '2024-01-01T00:00:00Z',
        term_end_date: '2024-12-31T23:59:59Z'
      },
      // Regular Creators
      {
        id: 'creator-2222-2222-2222-222222222222',
        user_id: '22222222-2222-2222-2222-222222222222',
        description: 'Tech educator and software developer. Creating tutorials, courses, and tools to help others learn programming and technology. Specializing in React, TypeScript, and modern web development.',
        is_elected: false,
        election_votes: 1756
      },
      {
        id: 'creator-4444-4444-4444-444444444444',
        user_id: '44444444-4444-4444-4444-444444444444',
        description: 'Writer and educator focused on making complex topics accessible. Promoting educational content and creator learning initiatives. Specializing in technical writing and communication.',
        is_elected: false,
        election_votes: 1432
      },
      {
        id: 'creator-9999-9999-9999-999999999999',
        user_id: '99999999-9999-9999-9999-999999999999',
        description: 'Professional chef and culinary instructor. Sharing recipes, cooking techniques, and food culture from around the world. Making gourmet cooking accessible to home cooks.',
        is_elected: false,
        election_votes: 1298
      },
      {
        id: 'creator-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        description: 'Certified personal trainer and nutrition coach. Helping people achieve their fitness goals through sustainable lifestyle changes. Promoting body positivity and mental wellness.',
        is_elected: false,
        election_votes: 1156
      },
      {
        id: 'creator-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        user_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        description: 'Professional photographer specializing in portrait and landscape photography. Teaching photography techniques and post-processing skills. Advocating for visual artists\' rights.',
        is_elected: false,
        election_votes: 1089
      },
      {
        id: 'creator-cccc-cccc-cccc-cccccccccccc',
        user_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        description: 'Gaming content creator and esports analyst. Covering the latest games, strategies, and industry news. Building a community of passionate gamers and competitive players.',
        is_elected: false,
        election_votes: 987
      },
      {
        id: 'creator-dddd-dddd-dddd-dddddddddddd',
        user_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        description: 'Beauty and skincare expert with 10+ years in the industry. Sharing honest product reviews, tutorials, and self-care tips. Promoting inclusive beauty standards.',
        is_elected: false,
        election_votes: 876
      },
      {
        id: 'creator-eeee-eeee-eeee-eeeeeeeeeeee',
        user_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        description: 'Travel blogger and cultural explorer. Documenting adventures around the world and sharing travel tips, cultural insights, and sustainable tourism practices.',
        is_elected: false,
        election_votes: 743
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

    // 3. Create comprehensive disputes for disputes page
    const fakeDisputes = [
      {
        id: 'dispute-1',
        plaintiff_id: '22222222-2222-2222-2222-222222222222', // Marcus
        defendant_id: '44444444-4444-4444-4444-444444444444', // David
        title: 'Copyright Infringement - Tutorial Content',
        description: 'Plaintiff claims defendant used copyrighted code examples and tutorial structure without permission in a published course. Seeking proper attribution and revenue sharing for the original work.',
        status: 'under_review',
        assigned_judge_id: '55555555-5555-5555-5555-555555555555', // Judge Smith
        created_at: '2024-06-18T11:00:00Z'
      },
      {
        id: 'dispute-2',
        plaintiff_id: '33333333-3333-3333-3333-333333333333', // Luna
        defendant_id: '22222222-2222-2222-2222-222222222222', // Marcus
        title: 'Revenue Sharing Dispute - Collaboration Project',
        description: 'Disagreement over revenue split for a joint educational project combining music production and coding tutorials. Original agreement was 50/50, but plaintiff claims they contributed 70% of the work.',
        status: 'resolved',
        assigned_judge_id: '55555555-5555-5555-5555-555555555555', // Judge Smith
        resolution: 'After reviewing documentation and time logs, revenue split adjusted to 65/35 in favor of plaintiff. Both parties agreed to clearer collaboration agreements for future projects.',
        created_at: '2024-06-10T15:30:00Z',
        resolved_at: '2024-06-20T10:15:00Z'
      },
      {
        id: 'dispute-3',
        plaintiff_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', // Sophia
        defendant_id: '99999999-9999-9999-9999-999999999999', // Emma
        title: 'Image Usage Without Permission',
        description: 'Professional photographer claims food blogger used copyrighted images in recipe posts without licensing or attribution. Seeking compensation and proper licensing agreement.',
        status: 'open',
        created_at: '2024-06-22T09:30:00Z'
      },
      {
        id: 'dispute-4',
        plaintiff_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // James
        defendant_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', // Ryan
        title: 'Trademark Violation - Brand Name',
        description: 'Fitness creator claims gaming creator is using a similar brand name that causes confusion among audiences. Seeking cessation of trademark use and potential damages.',
        status: 'under_review',
        assigned_judge_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', // Judge Martinez
        created_at: '2024-06-19T14:20:00Z'
      },
      {
        id: 'dispute-5',
        plaintiff_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', // Olivia
        defendant_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', // Noah
        title: 'Sponsored Content Disclosure Violation',
        description: 'Beauty creator alleges travel blogger failed to properly disclose sponsored content featuring beauty products, violating platform guidelines and potentially affecting brand partnerships.',
        status: 'resolved',
        assigned_judge_id: 'gggggggg-gggg-gggg-gggg-gggggggggggg', // Judge Lee
        resolution: 'Defendant agreed to update all relevant content with proper sponsorship disclosures and attend platform training on advertising guidelines. No financial penalties imposed.',
        created_at: '2024-06-15T11:45:00Z',
        resolved_at: '2024-06-21T16:30:00Z'
      },
      {
        id: 'dispute-6',
        plaintiff_id: '11111111-1111-1111-1111-111111111111', // Sarah
        defendant_id: '77777777-7777-7777-7777-777777777777', // Alex
        title: 'Design Template Licensing Dispute',
        description: 'UI/UX designer claims coding instructor is selling design templates that were originally created under a collaboration agreement with usage restrictions. Seeking clarification of licensing terms.',
        status: 'under_review',
        assigned_judge_id: '55555555-5555-5555-5555-555555555555', // Judge Smith
        created_at: '2024-06-21T13:15:00Z'
      },
      {
        id: 'dispute-7',
        plaintiff_id: '88888888-8888-8888-8888-888888888888', // Maya
        defendant_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', // Sophia
        title: 'Art Style Appropriation Claim',
        description: 'Digital artist claims photographer is copying distinctive artistic style and color grading techniques without permission, potentially confusing audiences and affecting market position.',
        status: 'dismissed',
        assigned_judge_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', // Judge Martinez
        resolution: 'Artistic styles and general techniques cannot be copyrighted. No evidence of direct copying of specific works. Case dismissed with recommendation for both parties to develop more distinctive branding.',
        created_at: '2024-06-12T10:00:00Z',
        resolved_at: '2024-06-18T14:45:00Z'
      },
      {
        id: 'dispute-8',
        plaintiff_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', // Ryan
        defendant_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', // James
        title: 'Defamation and False Claims',
        description: 'Gaming creator alleges fitness creator made false statements about gaming addiction and health impacts in educational content, potentially damaging reputation and subscriber base.',
        status: 'open',
        created_at: '2024-06-23T16:20:00Z'
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

    // 4. Create subscription tiers for all creators
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
      },
      // Alex's tiers
      {
        id: 'tier-alex-supporter',
        creator_id: 'creator-7777-7777-7777-777777777777',
        name: 'Code Academy',
        description: 'Learn full-stack development with structured courses',
        price_monthly: 12.00,
        tier_type: 'supporter',
        benefits: ['Access to all courses', 'Code review sessions', 'Career guidance'],
        is_active: true
      },
      // Maya's tiers
      {
        id: 'tier-maya-supporter',
        creator_id: 'creator-8888-8888-8888-888888888888',
        name: 'Art Patron',
        description: 'Support contemporary digital art',
        price_monthly: 15.00,
        tier_type: 'supporter',
        benefits: ['High-res artwork downloads', 'Process videos', 'Monthly art prints'],
        is_active: true
      },
      // Emma's tiers
      {
        id: 'tier-emma-supporter',
        creator_id: 'creator-9999-9999-9999-999999999999',
        name: 'Culinary Student',
        description: 'Learn professional cooking techniques',
        price_monthly: 9.00,
        tier_type: 'supporter',
        benefits: ['Recipe collections', 'Technique videos', 'Ingredient guides'],
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

    // 5. Create diverse content from multiple creators
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
        view_count: 3247,
        like_count: 189,
        comment_count: 43,
        tags: ['design', 'ui', 'trends', '2024'],
        created_at: '2024-06-20T10:00:00Z'
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
        view_count: 2876,
        like_count: 334,
        comment_count: 87,
        tags: ['music', 'single', 'indie', 'original'],
        created_at: '2024-06-22T20:00:00Z'
      },
      // Alex's content
      {
        id: 'content-alex-1',
        creator_id: 'creator-7777-7777-7777-777777777777',
        title: 'Full-Stack Development Roadmap 2024',
        description: 'Complete guide to becoming a full-stack developer',
        content_type: 'video',
        content_data: {
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 3600
        },
        tier_required: 'free',
        is_published: true,
        view_count: 4521,
        like_count: 267,
        comment_count: 78,
        tags: ['programming', 'fullstack', 'career', 'roadmap'],
        created_at: '2024-06-21T14:00:00Z'
      },
      // Maya's content
      {
        id: 'content-maya-1',
        creator_id: 'creator-8888-8888-8888-888888888888',
        title: 'Digital Art Process: Creating Vibrant Portraits',
        description: 'Step-by-step process of creating digital portraits with vibrant colors',
        content_type: 'video',
        content_data: {
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 1800
        },
        tier_required: 'supporter',
        is_published: true,
        view_count: 1987,
        like_count: 156,
        comment_count: 34,
        tags: ['digital-art', 'portrait', 'tutorial', 'process'],
        created_at: '2024-06-20T16:30:00Z'
      },
      // Emma's content
      {
        id: 'content-emma-1',
        creator_id: 'creator-9999-9999-9999-999999999999',
        title: 'Mastering French Pastry: Croissant Technique',
        description: 'Professional techniques for making perfect croissants at home',
        content_type: 'video',
        content_data: {
          video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnail_url: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
          duration: 2400
        },
        tier_required: 'supporter',
        is_published: true,
        view_count: 2345,
        like_count: 198,
        comment_count: 56,
        tags: ['cooking', 'pastry', 'french', 'technique'],
        created_at: '2024-06-19T11:00:00Z'
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

    // 6. Create proposals for governance
    const fakeProposals = [
      {
        id: 'proposal-1',
        creator_id: 'creator-1111-1111-1111-111111111111',
        title: 'Reduce Platform Fee to 8%',
        description: 'Proposal to reduce the platform fee from 10% to 8% to better support creators, especially those just starting out. This would increase creator earnings while maintaining platform sustainability.',
        proposal_type: 'revenue_sharing',
        status: 'voting',
        votes_for: 2847,
        votes_against: 456,
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
        votes_for: 3276,
        votes_against: 234,
        voting_deadline: '2024-06-30T23:59:59Z',
        created_at: '2024-06-10T14:30:00Z'
      },
      {
        id: 'proposal-3',
        creator_id: 'creator-7777-7777-7777-777777777777',
        title: 'Enhanced Creator Analytics Dashboard',
        description: 'Implement comprehensive analytics tools to help creators understand their audience, optimize content, and track revenue more effectively.',
        proposal_type: 'platform_policy',
        status: 'passed',
        votes_for: 3891,
        votes_against: 298,
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

    // 7. Create election votes for all creators
    const fakeElections = [
      // Votes for Sarah
      { candidate_id: 'creator-1111-1111-1111-111111111111', voter_id: '22222222-2222-2222-2222-222222222222' },
      { candidate_id: 'creator-1111-1111-1111-111111111111', voter_id: '44444444-4444-4444-4444-444444444444' },
      { candidate_id: 'creator-1111-1111-1111-111111111111', voter_id: '99999999-9999-9999-9999-999999999999' },
      // Votes for Luna
      { candidate_id: 'creator-3333-3333-3333-333333333333', voter_id: '77777777-7777-7777-7777-777777777777' },
      { candidate_id: 'creator-3333-3333-3333-333333333333', voter_id: '88888888-8888-8888-8888-888888888888' },
      // Votes for Alex
      { candidate_id: 'creator-7777-7777-7777-777777777777', voter_id: '11111111-1111-1111-1111-111111111111' },
      { candidate_id: 'creator-7777-7777-7777-777777777777', voter_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' },
      // Votes for Maya
      { candidate_id: 'creator-8888-8888-8888-888888888888', voter_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' },
      { candidate_id: 'creator-8888-8888-8888-888888888888', voter_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc' }
    ]

    for (const election of fakeElections) {
      const { error } = await supabase
        .from('elections')
        .insert(election)
      
      if (error && !error.message.includes('duplicate')) {
        console.log(`Election vote might already exist:`, error.message)
      }
    }

    // 8. Create creator earnings data
    const fakeEarnings = [
      {
        creator_id: 'creator-1111-1111-1111-111111111111',
        amount: 1250.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 125.00,
        net_amount: 1125.00,
        processed_at: '2024-06-01T00:00:00Z'
      },
      {
        creator_id: 'creator-3333-3333-3333-333333333333',
        amount: 2100.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 210.00,
        net_amount: 1890.00,
        processed_at: '2024-06-01T00:00:00Z'
      },
      {
        creator_id: 'creator-7777-7777-7777-777777777777',
        amount: 890.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 89.00,
        net_amount: 801.00,
        processed_at: '2024-06-01T00:00:00Z'
      },
      {
        creator_id: 'creator-8888-8888-8888-888888888888',
        amount: 675.00,
        currency: 'USD',
        transaction_type: 'subscription',
        platform_fee: 67.50,
        net_amount: 607.50,
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

    console.log('✅ Comprehensive fake data creation completed!')
    return { success: true, message: 'All fake data has been created successfully! Your presentation now has extensive creators and disputes data.' }

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