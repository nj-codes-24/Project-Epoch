-- supabase/seed.sql

-- Insert mock users into auth.users (this would trigger handle_new_user and create profiles)
-- For seed data without auth, we can just insert directly into profiles assuming auth.users is populated,
-- or we can insert into auth.users if we use Supabase's local testing environment.
-- Assuming we are using a typical Supabase local setup, we can create some test users.

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student1@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"full_name": "Student One", "user_name": "student_one"}'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student2@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"full_name": "Student Two", "user_name": "student_two"}'
  );

-- The trigger handle_new_user will automatically populate the profiles table for these users.

-- Wait a moment to ensure triggers run (conceptual, SQL runs synchronously)

-- Insert sample Papers
INSERT INTO public.papers (id, arxiv_id, semantic_id, title, plain_title, summary, why_it_matters, category, topic_tags, citation_count, published_at)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    '2305.12345',
    'sem12345',
    'Attention Is All You Need (Revisited)',
    'Transformers for modern software',
    'A simpler breakdown of transformer architecture and how it can be applied to everyday software. It replaces complex recurrent networks with scalable attention mechanisms.',
    'It allows you to build AI features into your app much faster without deep ML knowledge.',
    'Artificial Intelligence',
    ARRAY['transformers', 'llms', 'architecture'],
    150,
    '2023-05-01T10:00:00Z'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '2401.54321',
    'sem54321',
    'Serverless vs Edge Computing for React Apps',
    'Where to host your Next.js app',
    'This paper compares latency and costs between traditional serverless architectures and edge runtimes. It finds edge runtimes reduce cold starts by 80%.',
    'Deploying to the edge can make your React apps feel instantly responsive to users globally.',
    'Web Development',
    ARRAY['nextjs', 'edge', 'serverless', 'react'],
    45,
    '2024-01-15T12:00:00Z'
  );

-- Insert sample Tools
INSERT INTO public.tools (id, paper_id, github_url, name, description, stars, forks, last_commit_at)
VALUES
  (
    '55555555-5555-5555-5555-555555555555',
    '33333333-3333-3333-3333-333333333333',
    'https://github.com/huggingface/transformers',
    'huggingface/transformers',
    'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX.',
    120000,
    25000,
    '2024-05-20T00:00:00Z'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '44444444-4444-4444-4444-444444444444',
    'https://github.com/vercel/next.js',
    'vercel/next.js',
    'The React Framework for the Web.',
    115000,
    24000,
    '2024-05-25T00:00:00Z'
  );

-- Insert User Seen Papers
INSERT INTO public.user_seen_papers (user_id, paper_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333');

-- Insert Saved Papers
INSERT INTO public.saved_papers (user_id, paper_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444');

-- Insert Saved Tools
INSERT INTO public.saved_tools (user_id, tool_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666');
