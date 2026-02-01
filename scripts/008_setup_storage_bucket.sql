-- Create the product_images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product_images',
  'product_images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access" ON storage.objects;

-- Policy: Allow public read access to product images
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product_images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product_images');

-- Policy: Allow service role to manage all objects (for admin operations)
CREATE POLICY "Allow service role full access"
ON storage.objects
USING (bucket_id = 'product_images')
WITH CHECK (bucket_id = 'product_images');
