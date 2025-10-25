-- Create the meeting_assistants table
CREATE TABLE IF NOT EXISTS meeting_assistants (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    usher1 TEXT NOT NULL,
    usher2 TEXT NOT NULL,
    sacrament1 TEXT NOT NULL,
    sacrament2 TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the date column for faster queries
CREATE INDEX IF NOT EXISTS idx_meeting_assistants_date ON meeting_assistants(date);

-- Create a unique constraint on date to prevent duplicate entries for the same date
CREATE UNIQUE INDEX IF NOT EXISTS idx_meeting_assistants_unique_date ON meeting_assistants(date);

-- Enable Row Level Security (RLS)
ALTER TABLE meeting_assistants ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on meeting_assistants" ON meeting_assistants
    FOR ALL USING (true);

-- Optional: Create a table to track bot users and groups
CREATE TABLE IF NOT EXISTS bot_subscribers (
    id SERIAL PRIMARY KEY,
    line_id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('user', 'group')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for bot_subscribers
ALTER TABLE bot_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for bot_subscribers
CREATE POLICY "Allow all operations on bot_subscribers" ON bot_subscribers
    FOR ALL USING (true);
