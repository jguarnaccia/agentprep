-- Create scenarios_progress table to track user scenario attempts
CREATE TABLE IF NOT EXISTS public.scenarios_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INTEGER DEFAULT 0, -- Time in seconds
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for better query performance
    UNIQUE(user_id, scenario_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_scenarios_progress_user_id ON public.scenarios_progress(user_id);

-- Enable Row Level Security
ALTER TABLE public.scenarios_progress ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own progress
CREATE POLICY "Users can view their own scenario progress"
    ON public.scenarios_progress
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own progress
CREATE POLICY "Users can insert their own scenario progress"
    ON public.scenarios_progress
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own progress
CREATE POLICY "Users can update their own scenario progress"
    ON public.scenarios_progress
    FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON public.scenarios_progress TO authenticated;
GRANT ALL ON public.scenarios_progress TO service_role;
