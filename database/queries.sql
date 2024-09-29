INSERT INTO "orchestra" ( 
    "logo", 
    "email", 
    "address", 
    "history", 
    "facebook_url", 
    "instagram_url", 
    "youtube_url" 
  )
  VALUES ( 
    -- pg_read_file('/home/xyz')::bytea,
    -- pg_read_binary_file('/../cat.png'), 
    pg_read_binary_file("C:\Users\Oliwia\Downloads\cat.png"), -- an absolute path
    'e@mail.com', 
    'Rokicińska 10, Lodz', 
    'History...', 
    'https://www.facebook.com/', 
    'https://www.instagram.com/', 
    'https://www.youtube.com/'
  );
