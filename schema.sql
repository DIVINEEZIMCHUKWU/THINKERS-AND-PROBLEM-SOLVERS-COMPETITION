-- SQL Schema for School Competition Registration and Dashboard

-- 1. Enum types
CREATE TYPE student_status AS ENUM ('Pending', 'Verified');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE media_type AS ENUM ('winner_artwork', 'artwork_gallery', 'activity', 'video');
CREATE TYPE video_source AS ENUM ('youtube', 'drive');

-- 2. Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender gender_enum NOT NULL,
    country VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    passport_url VARCHAR(1024),
    payment_proof_url VARCHAR(1024),
    status student_status DEFAULT 'Pending',
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Admins Table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Content / Media Table
-- This handles Images (winner artworks, gallery artworks, activities) and Videos
CREATE TABLE media_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type media_type NOT NULL,
    title VARCHAR(255),
    url VARCHAR(1024) NOT NULL,
    video_type video_source, -- only applicable if type='video'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes for optimization
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_reg_no ON students(registration_number);
CREATE INDEX idx_media_content_type ON media_content(type);

-- 6. Updated At Triggers (PostgreSQL syntax)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_students_modtime 
BEFORE UPDATE ON students 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_media_content_modtime 
BEFORE UPDATE ON media_content 
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
