-------------------------------------------
-- Populates newssight tables with some
-- dummy data
-------------------------------------------


USE `newssight` ;

-------------------------------------------
-- News Sources
-------------------------------------------

-- ABC News
INSERT INTO `sources` (   
        `id`, 
        `name`, 
        `description`, 
        `url`, 
        `category`, 
        `country`, 
        `language`, 
        `topSortByAvailable`, 
        `latestSortByAvailable`, 
        `popularSortByAvailable`
    ) VALUES (
        'abc-news',
        'ABC News',
        'Your trusted source for breaking news, analysis, exclusive interviews, headlines, and videos at ABCNews.com.',
        'http://abcnews.go.com',
        'general',
        'us',
        'en',
        0,
        0,
        0
)

-- Associated Press
INSERT INTO `sources` (   
        `id`, 
        `name`, 
        `description`, 
        `url`, 
        `category`, 
        `country`, 
        `language`, 
        `topSortByAvailable`, 
        `latestSortByAvailable`, 
        `popularSortByAvailable`
    ) VALUES (
        'associated-press',
        'Associated Press',
        'The AP delivers in-depth coverage on the international, politics, lifestyle, business, and entertainment news.',
        'https://apnews.com/',
        'general',
        'us',
        'en',
        0,
        0,
        0
)

-- Bloomberg
INSERT INTO `sources` (   
        `id`, 
        `name`, 
        `description`, 
        `url`, 
        `category`, 
        `country`, 
        `language`, 
        `topSortByAvailable`, 
        `latestSortByAvailable`, 
        `popularSortByAvailable`
    ) VALUES (
        'bloomberg',
        'Bloomberg',
        'Bloomberg delivers business and markets news, data, analysis, and video to the world, featuring stories from Businessweek and Bloomberg News.',
        'http://www.bloomberg.com/',
        'business',
        'us',
        'en',
        0,
        0,
        0
)

-------------------------------------------
-- Users
-------------------------------------------

-- Username: saurav
-- Password: developer1
INSERT INTO `users` (
        `id`,
        `username`,
        `password`,
        `first_name`,
        `last_name`,
        `email`
    ) VALUES (
        '0',
        'saurav',
        '$2a$10$K5bPB3qf3Xw/9.vvMg/owuL0v3OU/HaVGJmqEkElx4ANxpNfh3Q4q',
        'Saurav',
        'Kadavath',
        'sauravkadavath@gmail.com'
)

-- Username: albert
-- Password: developer2
INSERT INTO `users` (
        `id`,
        `username`,
        `password`,
        `first_name`,
        `last_name`,
        `email`
    ) VALUES (
        '0',
        'albert',
        '$2a$10$AZy0Rrefmf0cJzFuO/fr0OHM2QhMA1bnt4E/mvJw1C6ZEBaaQZ.Eu',
        'Albert',
        'Einstein',
        'aeinstein@gmail.com'
)

-- Username: will
-- Password: developer3
INSERT INTO `users` (
        `id`,
        `username`,
        `password`,
        `first_name`,
        `last_name`,
        `email`
    ) VALUES (
        '0',
        'will',
        '$2a$10$JK1LMrK8oD6iOOMaWuopY.vQxiJ3t3xeR9QgyLGu6bOpBmRxVHfIO',
        'Will',
        'Smith',
        'willsmith@gmail.com'
)

