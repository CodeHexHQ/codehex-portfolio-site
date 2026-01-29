-- Create service_details table
CREATE TABLE IF NOT EXISTS public.service_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT NOT NULL,
    card_title TEXT NOT NULL,
    card_description TEXT NOT NULL,
    header_title TEXT NOT NULL,
    header_description TEXT NOT NULL,
    benefits TEXT[] DEFAULT '{}',
    tech_stack JSONB DEFAULT '[]',
    success_stories JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_service_id UNIQUE (service_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.service_details ENABLE ROW LEVEL SECURITY;

-- Create policies (Adjust based on your auth setup, assuming public read, admin write)
CREATE POLICY "Enable read access for all users" ON public.service_details
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.service_details
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.service_details
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.service_details
    FOR DELETE USING (auth.role() = 'authenticated');
