-- =============================================
-- V10: CLEAR PREVIOUS AND RESTORE BOOKS WITH DESCRIPTIONS
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE book_copies;
TRUNCATE TABLE book_categories;
TRUNCATE TABLE book_authors;
TRUNCATE TABLE books;
TRUNCATE TABLE categories;
TRUNCATE TABLE authors;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Authors
INSERT IGNORE INTO authors (author_id, author_name) VALUES
(100, 'Katsuya Yamakami'),
(101, 'Colleen Hoover'),
(102, 'Terry Pratchett'),
(103, 'Carl Sagan'),
(104, 'E. M. Forster'),
(105, 'Craig Thompson'),
(106, 'Hannah Grace'),
(107, 'Archie Superstars Staff'),
(108, 'Hayao Miyazaki'),
(109, 'Jeffrey Eugenides'),
(110, 'Naomi Novik'),
(111, 'Gertrude Chandler Warner'),
(112, 'Mark Wayne Harris'),
(113, 'Charles Bukowski'),
(114, 'Klaus Janson'),
(115, 'Junji Itō'),
(116, 'John Walkenbach'),
(117, 'Go Office'),
(118, 'Dav Pilkey'),
(119, 'NaRae Lee'),
(120, 'Kako Itō'),
(121, 'D. S. Malik'),
(122, 'Lincoln Pierce'),
(123, 'Stephen Hawking'),
(124, 'Paul J. Deitel'),
(125, 'James Patterson'),
(126, 'Yuval Noah Harari'),
(127, 'Matt Groening'),
(128, 'Winston S. Churchill'),
(129, 'Graham Annable'),
(130, 'Siddhartha Mukherjee'),
(131, 'Harvey M. Deitel'),
(132, 'Jostein Gaarder'),
(133, 'Mana Takahashi'),
(134, 'Blanko Comic'),
(135, 'Wesley Chun'),
(136, 'Katy Coope'),
(137, 'Sergi Cámara'),
(138, 'David Foster Wallace'),
(139, 'Sally Thorne'),
(140, 'Daniel Suarez'),
(141, 'Lisa Jewell'),
(142, 'Mark Lutz'),
(143, 'Ikari Studio'),
(144, 'Marie Kondo'),
(145, 'Society for the Study of Manga Techniques'),
(146, 'Gail Carriger'),
(147, 'Elisabetta Dami'),
(148, 'Arnold J. Toynbee'),
(149, 'Imam ghozali, 2018'),
(150, 'Jon Bentley'),
(151, 'Henry Yoshitaka Kiyama'),
(152, 'Howard Zinn'),
(153, 'Frederik L. Schodt'),
(154, 'Nicole Krauss'),
(155, 'Robert Lawrence Stine'),
(156, 'Shin Takahashi'),
(157, 'Sapphire'),
(158, 'Peter Frankopan'),
(159, 'Chuck Palahniuk'),
(160, 'William Gibson'),
(161, 'Stephen King'),
(162, 'Tove Jansson'),
(163, 'Y. Daniel Liang'),
(164, 'Gregorio F. Zaide'),
(165, 'H. Rider Haggard'),
(166, 'Donald Knuth'),
(167, 'Ἡρόδοτος'),
(168, 'Archie Superstars'),
(169, 'E. Balagurusamy'),
(170, 'Will Durant'),
(171, 'Nigel Kelly'),
(172, 'Comics'),
(173, 'Suzanne Young'),
(174, 'Theodore L. Brown'),
(175, 'Bill Bryson'),
(176, 'R. Nageswara Rao'),
(177, 'R. R. Palmer'),
(178, 'David Okum'),
(179, 'R. F. Kuang'),
(180, 'Kate Atkinson'),
(181, 'Brian W. Kernighan'),
(182, 'Kent Beck'),
(183, 'Marilyn Stokstad'),
(184, 'Bertrand Russell'),
(185, 'John Williams'),
(186, 'Paulo Coelho'),
(187, 'Teodoro A. Agoncillo'),
(188, 'Fletcher, Banister Sir'),
(189, 'Hikaru Hayashi'),
(190, 'Douglas V. Hall'),
(191, 'History'),
(192, 'Erin Hunter'),
(193, 'Mark Kurlansky'),
(194, 'Manga University'),
(195, 'Cassandra Jean'),
(196, 'Donna Tartt'),
(197, 'William Shakespeare'),
(198, 'Harold Abelson'),
(199, 'Larry Wall'),
(200, 'Scott McCloud'),
(201, 'Neil Fiore'),
(202, 'Lisi Harrison'),
(203, 'Raina Telgemeier'),
(204, 'Will Eisner'),
(205, 'Elena Armas'),
(206, 'Haruno Nagatomo'),
(207, 'Ramesh S. Gaonkar'),
(208, 'Robert Kirkman'),
(209, 'Bjarne Stroustrup'),
(210, 'Masashi Kishimoto'),
(211, 'George Brown Tindall'),
(212, 'Cartoch Arts'),
(213, 'Chimamanda Ngozi Adichie'),
(214, 'Kohta Hirano'),
(215, 'Alison Bechdel'),
(216, 'Chester Brown'),
(217, 'Marijn Haverbeke'),
(218, 'Paul S. Boyer'),
(219, 'Celeste Ng'),
(220, 'Wallace Wang'),
(221, 'Steve Martin'),
(222, 'Marie Lu'),
(223, 'Hokusai Katsushika'),
(224, 'Alexander Pope'),
(225, 'Brent Sudduth'),
(226, 'K. N. King'),
(227, 'Art Spiegelman');

-- 2. Categories
INSERT IGNORE INTO categories (category_id, category_name, created_at, updated_at, is_deleted) VALUES
(100, 'Manga', NOW(), NOW(), 0),
(101, 'Novel', NOW(), NOW(), 0),
(102, 'Comic', NOW(), NOW(), 0),
(103, 'Programming', NOW(), NOW(), 0),
(104, 'History', NOW(), NOW(), 0),
(105, 'Science', NOW(), NOW(), 0);

-- 3. Books
INSERT IGNORE INTO books (id, title, author, isbn, publisher, publication_date, pages, description, cover_image, rating, review_count, shelf_location, deposit_price, created_at, updated_at) VALUES
(100, 'How to Draw Manga', 'Katsuya Yamakami', 'ISBN-100', 'Unknown Publisher', '2023-01-01', 172, 'How to Draw Manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/1043387-L.jpg', 3.8, 167, 'A1-01', 140000, NOW(), NOW()),
(101, 'Ugly Love', 'Colleen Hoover', 'ISBN-101', 'Unknown Publisher', '2023-01-01', 329, 'ATTRACTION AT FIRST SIGHT CAN BE MESSY… When Tate Collins finds airline pilot Miles Archer passed out in front of her apartment door, it is definitely not love at first sight. They wouldn’t even go so far as to consider themselves friends. But what they do have is an undeniable mutual attraction. He doesn’t want love and she doesn’t have time for a relationship, but their chemistry cannot be ignored. Once their desires are out in the open, they realize they have the perfect set-up, as long as Tate can stick to two rules: Never ask about the past and don’t expect a future. Tate is determined that she can handle it, but when she realises that she can’t, will she be able to say no to her sexy pilot when he lives just next door?', 'https://covers.openlibrary.org/b/id/12856728-L.jpg', 3.2, 16, 'A1-01', 110000, NOW(), NOW()),
(102, 'Small Gods', 'Terry Pratchett', 'ISBN-102', 'Unknown Publisher', '2023-01-01', 139, 'In the beginning was the Word.

And the Word was: "Hey, you!"

For Brutha the novice is the Chosen One. He wants peace and justice and brotherly love.

He also wants the Inquisition to stop torturing him now, please...', 'https://covers.openlibrary.org/b/id/14648232-L.jpg', 4.0, 318, 'A1-01', 110000, NOW(), NOW()),
(103, 'Contact', 'Carl Sagan', 'ISBN-103', 'Unknown Publisher', '2023-01-01', 245, 'In December, 1999, a multinational team journeys out to the stars, to the most awesome encounter in human history. Who -- or what -- is out there? 
In Cosmos, Carl Sagan explained the universe. In Contact, he predicts its future -- and our own.', 'https://covers.openlibrary.org/b/id/4143957-L.jpg', 4.0, 462, 'A1-01', 80000, NOW(), NOW()),
(104, 'Maurice', 'E. M. Forster', 'ISBN-104', 'Unknown Publisher', '2023-01-01', 464, 'Maurice is a novel by E. M. Forster. A tale of homosexual love in early 20th-century England, it follows Maurice Hall from his schooldays through university and beyond. It was written in 1913–1914, and revised in 1932 and 1959–1960.', 'https://covers.openlibrary.org/b/id/1364882-L.jpg', 4.3, 395, 'A1-01', 70000, NOW(), NOW()),
(105, 'Blankets', 'Craig Thompson', 'ISBN-105', 'Unknown Publisher', '2023-01-01', 112, 'Loosely based on the author''s life, chronicling his journey from childhood to adulthood, exploring the people, experiences, and beliefs that he encountered along the way.', 'https://covers.openlibrary.org/b/id/940324-L.jpg', 3.6, 144, 'A1-01', 140000, NOW(), NOW()),
(106, 'November 9', 'Colleen Hoover', 'ISBN-106', 'Unknown Publisher', '2023-01-01', 106, '"Beloved #1 New York Times bestselling author Colleen Hoover returns with an unforgettable love story between a writer and his unexpected muse. 

Fallon meets Ben, an aspiring novelist, the day before her scheduled cross-country move. Their untimely attraction leads them to spend Fallon''s last day in L.A. together, and her eventful life becomes the creative inspiration Ben has always sought for his novel. Over time and amidst the various relationships and tribulations of their own separate lives, they continue to meet on the same date every year. Until one day Fallon becomes unsure if Ben has been telling her the truth or fabricating a perfect reality for the sake of the ultimate plot twist. Can Ben''s relationship with Fallon and simultaneously his novel be considered a love story if it ends in heartbreak?"--

Fallon meets Ben, an aspiring novelist, the day before her scheduled cross-country move. They spend Fallon''s last day in L.A. together, and her eventful life becomes the creative inspiration Ben has always sought for his novel. Amidst the various relationships and tribulations of their own separate lives they continue to meet on the same date every year. But has Ben has been telling her the truth... or fabricating a perfect reality for the sake of the ultimate plot twist?', 'https://covers.openlibrary.org/b/id/9219001-L.jpg', 3.1, 332, 'A1-01', 100000, NOW(), NOW()),
(107, 'Night Watch', 'Terry Pratchett', 'ISBN-107', 'Unknown Publisher', '2023-01-01', 282, 'One moment, Sir Sam Vimes is in his old patrolman form, chasing a sweet-talking psychopath across the rooftops of Ankh-Morpork. The next, he''s lying naked in the street, having been sent back thirty years courtesy of a group of time-manipulating monks who won''t leave well enough alone. This Discworld is a darker place that Vimes remembers too well, three decades before his title, fortune, beloved wife, and impending first child. Worse still, the murderer he''s pursuing has been transported back also. Worst of all, it''s the eve of a fabled street rebellion that needlessly destroyed more than a few good (and not so good) men. Sam Vimes knows his duty, and by changing history he might just save some worthwhile necks—though it could cost him his own personal future. Plus there''s a chance to steer a novice watchman straight and teach him a valuable thing or three about policing, an impressionable young copper named Sam Vimes.', 'https://covers.openlibrary.org/b/id/14649312-L.jpg', 4.1, 332, 'A1-01', 120000, NOW(), NOW()),
(108, 'Icebreaker', 'Hannah Grace', 'ISBN-108', 'Unknown Publisher', '2023-01-01', 273, '**A TikTok sensation! Sparks fly when a competitive figure skater and hockey team captain are forced to share a rink.**

Anastasia Allen has worked her entire life for a shot at Team USA. It looks like everything is going according to plan when she gets a full scholarship to the University of California, Maple Hills and lands a place on their competitive figure skating team.

Nothing will stand in her way, not even the captain of the hockey team, Nate Hawkins.

Nate is focus as team captain is on keeping his team on the ice. Which is tricky when a facilities mishap means they are forced to share a rink with the figure skating team including Anastasia, who clearly can''t stand him.

But when Anastasia''s skating partner faces an uncertain future, she may have to look to Nate to take her shot.

Sparks fly, but Anastasia isn''t worried because she could never like a hockey player, right? [**Icebreaker pdf**](https://chesserresources.com/doc/icebreaker-pdf/)', 'https://covers.openlibrary.org/b/id/13180728-L.jpg', 4.5, 190, 'A1-01', 90000, NOW(), NOW()),
(109, 'The best of Archie comics', 'Archie Superstars Staff', 'ISBN-109', 'Unknown Publisher', '2023-01-01', 166, 'Presents selections of Archie comics from the first comic ever published to more recent adventures of Archie Andrews and his friends in Riverdale.', 'https://covers.openlibrary.org/b/id/12841432-L.jpg', 4.5, 497, 'A1-01', 80000, NOW(), NOW()),
(110, 'Howl''s Moving Castle Film Comic vol. 4 (Howl''s Moving Castle Film Comics) (Howl''s Moving Castle Film', 'Hayao Miyazaki', 'ISBN-110', 'Unknown Publisher', '2023-01-01', 454, 'Howl''s Moving Castle Film Comic vol. 4 (Howl''s Moving Castle Film Comics) (Howl''s Moving Castle Film Comics) is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/764852-L.jpg', 3.4, 263, 'A1-01', 110000, NOW(), NOW()),
(111, 'Middlesex', 'Jeffrey Eugenides', 'ISBN-111', 'Unknown Publisher', '2023-01-01', 318, 'A unique coming of age story. While the main character in this novel is dealing with gender identity issues the main focus of this brilliantly written story is the confusion we all face as we grow into the person we were meant to be.  The reader finds himself identifying with the main character''s experiences. This is a brilliantly written story. The prose is honest in a way that few authors dare to write. Every word, every action, every thought, is symbolic of the common human experience.', 'https://covers.openlibrary.org/b/id/12367196-L.jpg', 3.3, 96, 'A1-01', 140000, NOW(), NOW()),
(112, 'Uprooted', 'Naomi Novik', 'ISBN-112', 'Unknown Publisher', '2023-01-01', 438, '"Our Dragon doesn''t eat the girls he takes, no matter what stories they tell outside our valley. We hear them sometimes, from travelers passing through. They talk as though we were doing human sacrifice, and he were a real dragon. Of course that''s not true: he may be a wizard and immortal, but he''s still a man, and our fathers would band together and kill him if he wanted to eat one of use every ten years. He protects us against the Wood, and we''re grateful, but not that grateful."', 'https://covers.openlibrary.org/b/id/8539161-L.jpg', 4.0, 445, 'A1-01', 120000, NOW(), NOW()),
(113, 'The Comic Book Mystery', 'Gertrude Chandler Warner', 'ISBN-113', 'Unknown Publisher', '2023-01-01', 183, 'The Alden children are searching for a rare comic book of their favorite superhero, Captain Fantastic. They finally find the comic and something else, too--a strange note inside, "signed" by the comic''s creator. The Aldens realize the note is a fake. But when they start to investigate, the mysterious note is stolen! It looks like someone wants to sabotage a superhero. The Aldens will need their super powers of investigation to catch this comic book culprit!', 'https://covers.openlibrary.org/b/id/1527396-L.jpg', 4.9, 466, 'A1-01', 140000, NOW(), NOW()),
(114, 'MC COMICS', 'Mark Wayne Harris', 'ISBN-114', 'Unknown Publisher', '2023-01-01', 122, 'MC COMICS is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/2615724-L.jpg', 4.2, 76, 'A1-01', 60000, NOW(), NOW()),
(115, 'Post office', 'Charles Bukowski', 'ISBN-115', 'Unknown Publisher', '2023-01-01', 494, 'Post office is a fascinating book covering topics in novel.', 'https://covers.openlibrary.org/b/id/670128-L.jpg', 3.0, 446, 'A1-01', 50000, NOW(), NOW()),
(116, 'Dc Comics Guide to Pencilling Comics', 'Klaus Janson', 'ISBN-116', 'Unknown Publisher', '2023-01-01', 200, 'Dc Comics Guide to Pencilling Comics is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/4639404-L.jpg', 5.0, 266, 'A1-01', 120000, NOW(), NOW()),
(117, 'Shiver', 'Junji Itō', 'ISBN-117', 'Unknown Publisher', '2023-01-01', 172, '"This volume includes nine of Junji Ito''s best short stories, as selected by the author himself and presented with accompanying notes and commentary. An arm peppered with tiny holes dangles from a sick girl''s window... After an idol hangs herself, balloons bearing faces appear in the sky, some even featuring your own face... An amateur film crew hires an extremely individualistic fashion model and faces a real bloody ending... An offering of nine fresh nightmares for the delectation of horror fans"--Amazon.', 'https://covers.openlibrary.org/b/id/10509676-L.jpg', 4.3, 280, 'A1-01', 130000, NOW(), NOW()),
(118, 'Excel VBA Programming For Dummies', 'John Walkenbach', 'ISBN-118', 'Unknown Publisher', '2023-01-01', 197, 'Having Excel and just using it for standard spreadsheets is a little like getting the ultimate cable system and a 50" flat panel plasma HDTV and using it exclusively to watch Lawrence Welk reruns. With Visual Basic for Applications (VBA) programming, you can take advantage of numerous Excel options such as: creating new worksheet functions; automating tasks and operations; creating new appearances, toolbars, and menus; designing custom dialog boxes and add-ins; and much more.   This guide is not for rank Excel amateurs. It''s for intermediate to advanced Excel users who want to learn VBA programming (or whose bosses want them to learn VBA programming). You need to know your way around Excel before you start creating customized short cuts or systems for speeding through Excel functions. If you''re an intermediate or advanced Excel user, Excel VBA For Dummies helps you take your skills (and your spreadsheets) to the next level. It includes:    An introduction to the VBA language  A hands-on, guided, step-by-step walk through developing a useful VBA macro, including recording, testing, and changing it, and testing it  The essential foundation, including the Visual Basic Editor (VBE) and its components, modules, Excel object model, subroutines and functions, and the Excel macro recorder  The essential VBA language elements, including comments, variables and constants, and labels  Working with Range objects and discovering useful Range objective properties and methods  Using VBA and worksheet functions, including a list and examples  Programming constructions, including the GoTo statement, the If-Then structure, Select Case, For-Next loop, Do-While loop, and Do-Until loop  Automatic procedures and Workbook events, including a table and event-handler procedures  Error-handling and bug extermination techniques, and using the Excel debugging tools  Creating custom dialog boxes, also known as UserForms, with a table of the toolbox controls and their capabilities, how-to for the dialog box controls, and UserForm techniques and tricks  Customizing the Excel toolbars  Using VBA code to modify the Excel menu system  Creating worksheet functions and working with various types of arguments  Creating Excel add-ins such as new worksheet functions you can use in formulas or new commands or utilities     Author John Walkenbach is a leading authority on spreadsheet software and the author of more than 40 spreadsheet books including Excel 2003 Bible and Excel 2003 Power Programming with VBA. While this guide includes tons of examples and screenshots, Walkenbach knows there''s no substitute for hands-on learning. The book is complete with:    A dedicated companion Web site that includes bonus chapters plus all sample programs to save you a lot of typing and let you play around and experiment with various changes  Information to help you make the most of Excel''s built-in Help system so you can find out other stuff you may need to know     What are you waiting for? Sure, learning to do VBA programming takes a little effort, but it''s a Very Big Accomplishment.', 'https://covers.openlibrary.org/b/id/6428424-L.jpg', 3.8, 356, 'A1-01', 120000, NOW(), NOW()),
(119, 'How To Draw Manga: Ultimate Manga Lessons Volume 5', 'Go Office', 'ISBN-119', 'Unknown Publisher', '2023-01-01', 182, 'How To Draw Manga: Ultimate Manga Lessons Volume 5 is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/1043410-L.jpg', 4.3, 507, 'A1-01', 50000, NOW(), NOW()),
(120, 'Cat Kid Comic Club #2', 'Dav Pilkey', 'ISBN-120', 'Unknown Publisher', '2023-01-01', 447, 'Cat Kid Comic Club #2 is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/12377735-L.jpg', 3.9, 90, 'A1-01', 120000, NOW(), NOW()),
(121, 'Maximum Ride. The Manga 1', 'NaRae Lee', 'ISBN-121', 'Unknown Publisher', '2023-01-01', 435, '"Fourteen-year-old Maximum Ride knows what it''s like to soar above the world. She and all the members of her ''flock''-- Fang, Iggy, Nudge, Gasman, and Angel-- are just like ordinary kids, except they have wings and can fly! It may seem like a dream come true to some, but for the flock it''s more like a living nightmare when the mysterious lab known as the ''School'' turns up and kidnaps their youngest member. Now it''s up to Max to organize a rescue, but will help come in time?" -- p. [4] of cover.', 'https://covers.openlibrary.org/b/id/7407524-L.jpg', 4.2, 332, 'A1-01', 120000, NOW(), NOW()),
(122, 'A Girl in a Million', 'Kako Itō', 'ISBN-122', 'Unknown Publisher', '2023-01-01', 202, '"You want me?"

Caroline Frisby was right for the job--after all, she''d established an excellent rapport with the little boy while he was in the hospital in England. It only made sense that she be the one to supervise Marc''s recovery back home in Holland. 

But was she the right girl for the man? Marius van Houben, the boy''s uncle, was rich, attractive and successful--and very single. He could have any girl he wanted. What were the chances that he would want her? 

Caroline knew they were one in a million.', 'https://covers.openlibrary.org/b/id/219035-L.jpg', 4.3, 442, 'A1-01', 130000, NOW(), NOW()),
(123, 'C++ Programming', 'D. S. Malik', 'ISBN-123', 'Unknown Publisher', '2023-01-01', 245, 'Written for the modern programmer, this innovative text does not rely heavily on math and engineering-orientated skills, but focuses on the nature and obvious advantages of C++ as a language.', 'https://covers.openlibrary.org/b/id/762861-L.jpg', 3.4, 334, 'A1-01', 70000, NOW(), NOW()),
(124, 'Big Nate Out Loud', 'Lincoln Pierce', 'ISBN-124', 'Unknown Publisher', '2023-01-01', 359, 'Big Nate Out Loud is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/7966559-L.jpg', 4.9, 470, 'A1-01', 60000, NOW(), NOW()),
(125, 'A Brief History of Time', 'Stephen Hawking', 'ISBN-125', 'Unknown Publisher', '2023-01-01', 474, 'Stephen Hawking''s ‘A Brief History of Time* has become an international publishing phenomenon. Translated into thirty languages, it has sold over ten million copies worldwide and lives on as a science book that continues to captivate and inspire new readers each year. When it was first published in 1988 the ideas discussed in it were at the cutting edge of what was then known about the universe. In the intervening twenty years there have been extraordinary advances in the technology of observing both the micro- and macro-cosmic world. Indeed, during that time cosmology and the theoretical sciences have entered a new golden age . Professor Hawking is one of the major scientists and thinkers to have contributed to this renaissance.', 'https://covers.openlibrary.org/b/id/10432365-L.jpg', 3.6, 377, 'A1-01', 70000, NOW(), NOW()),
(126, 'C++', 'Paul J. Deitel', 'ISBN-126', 'Unknown Publisher', '2023-01-01', 328, '*Publisher''s description:* For Introduction to Programming (CS1) and other more intermediate courses covering programming in C++. Also appropriate as a supplement for upper-level courses where the instructor uses a book as a reference for the C++ language. This best-selling comprehensive text is aimed at readers with little or no programming experience. It teaches programming by presenting the concepts in the context of full working programs and takes and early objects approach. The text has an emphasis on achieving program clarity through structured and object-oriented programming, software reuse and component-oriented software construction. The Sixth Edition reflects the suggested improvements of a distinguished team of industry professionals and academics.', 'https://covers.openlibrary.org/b/id/15111450-L.jpg', 4.3, 52, 'A1-01', 100000, NOW(), NOW()),
(127, 'Witch & wizard', 'James Patterson', 'ISBN-127', 'Unknown Publisher', '2023-01-01', 445, '**Your books, music, and art - BANNED**

*You are holding an urgent and vital narrative that reveals the forbidden truth about these perilous times...*

This is the astonishing testimonial of Wisty and Whit Allgood, a sister and brother who were torn from their family in the middle of the night, slammed into prison, and accused of being a witch and wizard.

They are not alone in their terrifying predicament. Thousands of young people have been kidnapped. Some have been accused; many others remain missing. Their fate is unknown, and the worst is feared - for the ruling regime will stop at nothing to suppress life and liberty, music and books, art and magic... and the pursuit of being a normal teenager. 

Most copies of this story have already been seized, shredded, or burned. Read this rare, surviving edition and pass it along with care - before it''s too late.', 'https://covers.openlibrary.org/b/id/6424662-L.jpg', 4.2, 173, 'A1-01', 50000, NOW(), NOW()),
(128, 'Sapiens', 'Yuval Noah Harari', 'ISBN-128', 'Unknown Publisher', '2023-01-01', 146, 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller—that explores the ways in which biology and history have defined us and enhanced our understanding of what it means to be “human.”

One hundred thousand years ago, at least six different species of humans inhabited Earth. Yet today there is only one—homo sapiens. What happened to the others? And what may happen to us?

Most books about the history of humanity pursue either a historical or a biological approach, but Dr. Yuval Noah Harari breaks the mold with this highly original book that begins about 70,000 years ago with the appearance of modern cognition. From examining the role evolving humans have played in the global ecosystem to charting the rise of empires, Sapiens integrates history and science to reconsider accepted narratives, connect past developments with contemporary concerns, and examine specific events within the context of larger ideas.

Dr. Harari also compels us to look ahead, because over the last few decades humans have begun to bend laws of natural selection that have governed life for the past four billion years. We are acquiring the ability to design not only the world around us, but also ourselves. Where is this leading us, and what do we want to become?

Featuring 27 photographs, 6 maps, and 25 illustrations/diagrams, this provocative and insightful work is sure to spark debate and is essential reading for aficionados of Jared Diamond, James Gleick, Matt Ridley, Robert Wright, and Sharon Moalem.', 'https://covers.openlibrary.org/b/id/8634250-L.jpg', 3.7, 372, 'A1-01', 60000, NOW(), NOW()),
(129, 'Simpsons comics Strike Back', 'Matt Groening', 'ISBN-129', 'Unknown Publisher', '2023-01-01', 268, 'All new (in)action from the family that brought you conspicuous consumerism, The Simpsons. The very fabric of suburban life appears to be unravelling in this collection when the TV breaks down, Aunt Patty and Aunt Selma come to stay, and the President gets tough with Homer''s waistline.', 'https://covers.openlibrary.org/b/id/41706-L.jpg', 4.9, 246, 'A1-01', 100000, NOW(), NOW()),
(130, 'A history of the English-speaking peoples', 'Winston S. Churchill', 'ISBN-130', 'Unknown Publisher', '2023-01-01', 103, 'Sketches of sixteen of Churchill''s favorite historical characters selected from his four-volume A history of the English-speaking Peoples, followed by a profile of Sir Winston drawn from autobiographical writings and speeches.', 'https://covers.openlibrary.org/b/id/6602132-L.jpg', 4.0, 259, 'A1-01', 80000, NOW(), NOW()),
(131, 'Comic crazy!', 'Graham Annable', 'ISBN-131', 'Unknown Publisher', '2023-01-01', 383, 'Plankton wears a Patrick costume to try to weasel the Krabby Patty recipe out of SpongeBob, and baking a "Cheer up!" cake for Squidward gets the Krusty Krab closed by the health inspector.', 'https://covers.openlibrary.org/b/id/13812877-L.jpg', 3.3, 124, 'A1-01', 100000, NOW(), NOW()),
(132, 'The Gene', 'Siddhartha Mukherjee', 'ISBN-132', 'Unknown Publisher', '2023-01-01', 441, 'The Gene: An Intimate History is a book written by Siddhartha Mukherjee, an Indian-born American physician and oncologist. It was published on 17 May 2016 by Scribner. The book chronicles the history of the gene and genetic research, all the way from Aristotle to Crick, Watson and Franklin and then the 21st century scientists who mapped the human genome. The book discusses the power of genetics in determining people''s well-being and traits. It delves into the personal genetic history of Siddhartha Mukherjee''s family, including mental illness. However, it is also a cautionary message toward not letting genetic predispositions define a person or their fate, a mentality that the author says led to the rise of eugenics in history.', 'https://covers.openlibrary.org/b/id/11320163-L.jpg', 3.9, 223, 'A1-01', 90000, NOW(), NOW()),
(133, 'C how to program', 'Harvey M. Deitel', 'ISBN-133', 'Unknown Publisher', '2023-01-01', 141, 'C how to program is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/14520000-L.jpg', 4.8, 345, 'A1-01', 130000, NOW(), NOW()),
(134, 'Sofies verden', 'Jostein Gaarder', 'ISBN-134', 'Unknown Publisher', '2023-01-01', 311, 'A page-turning novel that is also an exploration of the great philosophical concepts of Western thought, Sophie''s World has fired the imagination of readers all over the world, with more than twenty million copies in print.

One day fourteen-year-old Sophie Amundsen comes home from school to find in her mailbox two notes, with one question on each: "Who are you?" and "Where does the world come from?" From that irresistible beginning, Sophie becomes obsessed with questions that take her far beyond what she knows of her Norwegian village. Through those letters, she enrolls in a kind of correspondence course, covering Socrates to Sartre, with a mysterious philosopher, while receiving letters addressed to another girl. Who is Hilde? And why does her mail keep turning up? To unravel this riddle, Sophie must use the philosophy she is learning―but the truth turns out to be far more complicated than she could have imagined.', 'https://covers.openlibrary.org/b/id/223463-L.jpg', 4.5, 385, 'A1-01', 110000, NOW(), NOW()),
(135, 'The Manga Guide to Databases', 'Mana Takahashi', 'ISBN-135', 'Unknown Publisher', '2023-01-01', 100, 'The Manga Guide to Databases is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/9263847-L.jpg', 4.2, 145, 'A1-01', 70000, NOW(), NOW()),
(136, 'Blanko Comic', 'Blanko Comic', 'ISBN-136', 'Unknown Publisher', '2023-01-01', 343, 'Blanko Comic is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/13187794-L.jpg', 5.0, 344, 'A1-01', 60000, NOW(), NOW()),
(137, 'Core Python programming', 'Wesley Chun', 'ISBN-137', 'Unknown Publisher', '2023-01-01', 188, 'Core Python programming is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/7972455-L.jpg', 3.5, 276, 'A1-01', 50000, NOW(), NOW()),
(138, 'How to draw more Manga', 'Katy Coope', 'ISBN-138', 'Unknown Publisher', '2023-01-01', 122, 'Learn to draw the art of Manga. This book takes you step by step from creating realistic faces to the different styles of bodies to coloring in your characters and scenes.', 'https://covers.openlibrary.org/b/id/6806543-L.jpg', 3.2, 477, 'A1-01', 80000, NOW(), NOW()),
(139, 'Art of drawing manga', 'Sergi Cámara', 'ISBN-139', 'Unknown Publisher', '2023-01-01', 230, 'Art of drawing manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/752497-L.jpg', 4.1, 238, 'A1-01', 50000, NOW(), NOW()),
(140, 'Infinite Jest', 'David Foster Wallace', 'ISBN-140', 'Unknown Publisher', '2023-01-01', 288, 'A gargantuan, mind-altering comedy about the Pursuit of Happiness in America Set in an addicts'' halfway house and a tennis academy, and featuring the most endearingly screwed-up family to come along in recent fiction, Infinite Jest explores essential questions about what entertainment is and why it has come to so dominate our lives; about how our desire for entertainment affects our need to connect with other people; and about what the pleasures we choose say about who we are. Equal parts philosophical quest and screwball comedy, Infinite Jest bends every rule of fiction without sacrificing for a moment its own entertainment value. It is an exuberant, uniquely American exploration of the passions that make us human - and one of those rare books that renew the idea of what a novel can do.', 'https://covers.openlibrary.org/b/id/8237639-L.jpg', 4.4, 26, 'A1-01', 140000, NOW(), NOW()),
(141, 'The Hating Game', 'Sally Thorne', 'ISBN-141', 'Unknown Publisher', '2023-01-01', 225, 'For Lucy Hutton and Joshua Templeman, executive assistants to the CEOs of newly merged Bexley-Gamin Publishing, it''s hate-at-first-sight. So begins a series of daily passive-aggressive maneuvers, including the staring game, the mirror game, and the HR game, each played with the intensity of the Hunger Games. Their mutual antipathy grows when a new executive position opens at Bexley-Gamin, and both their bosses put their names up for the promotion. Then, the high-stakes games begin! After another 60-hour work week, Lucy logs off her computer and hops on the elevator to head home, as does Joshua. When Joshua hits the emergency button and stops the ride, Lucy is certain her nemesis is going to kill her. Instead, he plants a kiss on her, and Lucy begins to wonder if she really does hate Joshua after all, or if this is yet another game. --', 'https://covers.openlibrary.org/b/id/9247684-L.jpg', 3.4, 262, 'A1-01', 120000, NOW(), NOW()),
(142, 'Daemon', 'Daniel Suarez', 'ISBN-142', 'Unknown Publisher', '2023-01-01', 241, 'Already an underground sensation, a high-tech thriller for the wireless age that explores the unthinkable consequences of a computer program running without human control—a daemon—designed to dismantle society and bring about a new world order.

Technology controls almost everything in our modern-day world, from remote entry on our cars to access to our homes, from the flight controls of our airplanes to the movements of the entire world economy. Thousands of autonomous computer programs, or daemons, make our networked world possible, running constantly in the background of our lives, trafficking e-mail, transferring money, and monitoring power grids. For the most part, daemons are benign, but the same can''t always be said for the people who design them.

Matthew Sobol was a legendary computer game designer—the architect behind half-a-dozen popular online games. His premature death depressed both gamers and his company''s stock price. But Sobol''s fans aren''t the only ones to note his passing. When his obituary is posted online, a previously dormant daemon activates, initiating a chain of events intended to unravel the fabric of our hyper-efficient, interconnected world. With Sobol''s secrets buried along with him, and as new layers of his daemon are unleashed at every turn, it''s up to an unlikely alliance to decipher his intricate plans and wrest the world from the grasp of a nameless, faceless enemy—or learn to live in a society in which we are no longer in control...

Computer technology expert Daniel Suarez blends haunting high-tech realism with gripping suspense in an authentic, complex thriller in the tradition of Michael Crichton, Neal Stephenson, and William Gibson.', 'https://covers.openlibrary.org/b/id/6404884-L.jpg', 4.3, 397, 'A1-01', 60000, NOW(), NOW()),
(143, 'Then She Was Gone', 'Lisa Jewell', 'ISBN-143', 'Unknown Publisher', '2023-01-01', 414, '"Ten years after her teenage daughter disappears, a woman crosses paths with a charming single father whose young child feels eerily familiar, in this evocative, suspenseful drama from New York Times bestselling author Lisa Jewell--perfect for fans of Paula Hawkins and Liane Moriarty. Ellie Mack was the perfect daughter. She was fifteen, the youngest of three. She was beloved by her parents, friends, and teachers. She and her boyfriend made a teenaged golden couple. She was days away from an idyllic post-exams summer vacation, with her whole life ahead of her. And then she was gone. Now, her mother Laurel Mack is trying to put her life back together. It''s been ten years since her daughter disappeared, seven years since her marriage ended, and only months since the last clue in Ellie''s case was unearthed. So when she meets an unexpectedly charming man in a cafe, no one is more surprised than Laurel at how quickly their flirtation develops into something deeper. Before she knows it, she''s meeting Floyd''s daughters--and his youngest, Poppy, takes Laurel''s breath away. Because looking at Poppy is like looking at Ellie. And now, the unanswered questions she''s tried so hard to put to rest begin to haunt Laurel anew. Where did Ellie go? Did she really run away from home, as the police have long suspected, or was there a more sinister reason for her disappearance? Who is Floyd, really? And why does his daughter remind Laurel so viscerally of her own missing girl?"--', 'https://covers.openlibrary.org/b/id/10139078-L.jpg', 4.6, 463, 'A1-01', 50000, NOW(), NOW()),
(144, 'Programming Python', 'Mark Lutz', 'ISBN-144', 'Unknown Publisher', '2023-01-01', 409, 'Accompanying CD-ROM has examples from the book, Python 2.0 interpreter and standard documentation manuals, Python-related software packages, and the full Python 2.0 source code for PC, Macintosh, and Unix platforms.', 'https://covers.openlibrary.org/b/id/805644-L.jpg', 3.2, 312, 'A1-01', 140000, NOW(), NOW()),
(145, 'Erotic Manga', 'Ikari Studio', 'ISBN-145', 'Unknown Publisher', '2023-01-01', 392, 'Erotic Manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/4941855-L.jpg', 3.4, 117, 'A1-01', 50000, NOW(), NOW()),
(146, 'The Life-Changing Magic of Tidying Up', 'Marie Kondo', 'ISBN-146', 'Unknown Publisher', '2023-01-01', 278, 'Japanese cleaning consultant Marie Kondo takes tidying to a whole new level, promising that if you properly simplify and organize your house once, you''ll never have to do it again.  Most methods advocate a room-by-room approach, which doom you to pick away at your piles of stuff forever.  The KonMari Method, with its revolutionary category-by-category system, leads to lasting results.  In fact, none of Kondo''s clients have lapsed (and she still has a three-month wait list).  
With detailed guidance for determining which items in your house "spark joy" (and which don''t), this international best-seller featuring Tokyo''s newest lifestyle phenomenon will help you clear your clutter and enjoy the unique magic of a tidy home - and the calm, motivated mindset it can inspire.', 'https://covers.openlibrary.org/b/id/7367218-L.jpg', 3.1, 263, 'A1-01', 60000, NOW(), NOW()),
(147, 'How to Draw Manga', 'Society for the Study of Manga Techniques', 'ISBN-147', 'Unknown Publisher', '2023-01-01', 169, 'How to Draw Manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/1043370-L.jpg', 3.7, 419, 'A1-01', 60000, NOW(), NOW()),
(148, 'Soulless', 'Gail Carriger', 'ISBN-148', 'Unknown Publisher', '2023-01-01', 442, 'Alexia Tarabotti is laboring under a great many social tribulations. First, she has no soul. Second, she''s a spinster whose father is both Italian and dead. Third, she was rudely attacked by a vampire, breaking all standards of social etiquette. Where to go from there? From bad to worse apparently, for Alexia accidentally kills the vampire -- and then the appalling Lord Maccon (loud, messy, gorgeous, and werewolf) is sent by Queen Victoria to investigate. With unexpected vampires appearing and expected vampires disappearing, everyone seems to believe Alexia responsible. Can she figure out what is actually happening to London''s high society? Will her soulless ability to negate supernatural powers prove useful or just plain embarrassing? Finally, who is the real enemy, and do they have treacle tart?SOULLESS is a comedy of manners set in Victorian London: full of werewolves, vampires, dirigibles, and tea-drinking.', 'https://covers.openlibrary.org/b/id/6294570-L.jpg', 3.7, 24, 'A1-01', 140000, NOW(), NOW()),
(149, 'Aspettando L''Onda Gigante', 'Elisabetta Dami', 'ISBN-149', 'Unknown Publisher', '2023-01-01', 204, '"The Thea Sisters are five fun, lively students at Mouseford Academy on Whale Island, who want to be real, live journalists, just like their hero, Thea Stilton. Between classes, friendships, crushes, and some bizarre mysteries to solve, they find life to be a never-ending adventure! Everyone is talking about Windy Island''s new surf center, even Nicky''s hero, Australian surf champion Gary Moon! The artificial reef is supposed to create perfect waves. But the Thea Sisters have discovered a dangerous secret: even a surf champion can''t face these giant waves! it''s up to them to break the story before another reef is built off the shore of their beloved Donkey Beach" --

A new, exclusive surfing club has just opened on Windy Island. Residents know that the island is famous for its sudden storms, but their warnings fall on deaf ears until a giant wave hits. Book #4', 'https://covers.openlibrary.org/b/id/7250492-L.jpg', 4.7, 414, 'A1-01', 140000, NOW(), NOW()),
(150, 'A Study of History', 'Arnold J. Toynbee', 'ISBN-150', 'Unknown Publisher', '2023-01-01', 320, 'A masterful attempt to describe a universal history. Staggering depth of scholarship and breath of thought.', 'https://covers.openlibrary.org/b/id/121255-L.jpg', 3.5, 212, 'A1-01', 70000, NOW(), NOW()),
(151, 'Aplikasi Analisis Multivariate Dengan Program IBM SPSS 25 (9th ed)', 'Imam ghozali, 2018', 'ISBN-151', 'Unknown Publisher', '2023-01-01', 144, 'Aplikasi Analisis Multivariate Dengan Program IBM SPSS 25 (9th ed) is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/14911282-L.jpg', 4.0, 456, 'A1-01', 70000, NOW(), NOW()),
(152, 'Programming Pearls', 'Jon Bentley', 'ISBN-152', 'Unknown Publisher', '2023-01-01', 265, 'Programming Pearls is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/135673-L.jpg', 4.2, 155, 'A1-01', 120000, NOW(), NOW()),
(153, 'The four immigrants manga', 'Henry Yoshitaka Kiyama', 'ISBN-153', 'Unknown Publisher', '2023-01-01', 365, 'The four immigrants manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/926910-L.jpg', 3.3, 27, 'A1-01', 130000, NOW(), NOW()),
(154, 'A People''s History of the United States', 'Howard Zinn', 'ISBN-154', 'Unknown Publisher', '2023-01-01', 133, 'Known for its lively, clear prose as well as its scholarly research, *A People''s History of the United States* is the only volume to tell America''s story from the point of view of -- and in the words of -- America''s women, factory workers, African Americans, Native Americans, working poor, and immigrant laborers.', 'https://covers.openlibrary.org/b/id/10592817-L.jpg', 3.8, 391, 'A1-01', 60000, NOW(), NOW()),
(155, 'Manga! Manga!', 'Frederik L. Schodt', 'ISBN-155', 'Unknown Publisher', '2023-01-01', 306, 'Manga in Japanese means "comics," and comics in Japan are simply the most marvelous multifaceted misunderstood mass-market monster publishing phenomenon ever, anywhere. A multibillion dollar industry ... tens of millions of devoted fans ... thousands of ceaselessly toiling artists, a few of whom grow fabulously wealthy. There''s something for everyone, too, from historical romances set in the French revolution and bloody duels between medieval samurai, to tales of wrestlers, enlightened Buddhist sages, spacemen, anthropomorphic cats, gangsters, girls in and out of love, warrior robots, sushi-makers, and even the tireless Mr. Nobody at the office, the esteemed soldier in Japan''s economic-miracle army. Until now, this world has been hardly remarked upon by Western observers, except for mention of the fact that on trains, in restaurants, and indeed at every leisure moment the Japanese seem to have their heads buried in comics. But with this book Japanese comics emerge in all their spectacular variety for the first time in English. Author Fred Schodt offers a wealth of highlights and sidelights into history, themes, and artists. And every page is chock-full of samples from Japanese comic magazines. Here is popular culture running at a high pitch, and outsiders might find it all a bit puzzling and perverse. So if you''re a bit straitlaced take it slow. But if your assumptions about comics are open to challenge, or if you thought you knew the real Japan because you''ve read all about Zen and the tea ceremony and Theory Z, read on, read on.', 'https://covers.openlibrary.org/b/id/4787783-L.jpg', 4.8, 73, 'A1-01', 90000, NOW(), NOW()),
(156, 'The History of Love', 'Nicole Krauss', 'ISBN-156', 'Unknown Publisher', '2023-01-01', 140, 'Fourteen-year-old Alma Singer is trying to find a cure for her mother''s loneliness. Believing that she might discover it in an old book her mother is lovingly translating, she sets out in search of its author. Across New York an old man named Leo Gursky is trying to survive a little bit longer.

He spends his days dreaming of the lost love who, sixty years ago in Poland, inspired him to write a book. And although he doesn''t know it yet, that book also survived: crossing oceans and generations, and changing lives.', 'https://covers.openlibrary.org/b/id/251178-L.jpg', 3.6, 306, 'A1-01', 130000, NOW(), NOW()),
(157, 'Give Yourself Goosebumps - Little Comic Shop of Horrors', 'Robert Lawrence Stine', 'ISBN-157', 'Unknown Publisher', '2023-01-01', 489, 'Part of the "Goosebumps" horror series for young adults.', 'https://covers.openlibrary.org/b/id/385815-L.jpg', 4.8, 426, 'A1-01', 120000, NOW(), NOW()),
(158, 'The Manga Guide to Statistics', 'Shin Takahashi', 'ISBN-158', 'Unknown Publisher', '2023-01-01', 168, 'The Manga Guide to Statistics is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/9268829-L.jpg', 3.4, 390, 'A1-01', 80000, NOW(), NOW()),
(159, 'Push', 'Sapphire', 'ISBN-159', 'Unknown Publisher', '2023-01-01', 491, 'Precious Jones, an illiterate sixteen-year-old, has up until now been invisible: invisible to the father who rapes her and the mother who batters her and to the authorities who dismiss her as just one more of Harlem''s casualties. But when Precious, pregnant with a second child by her father, meets a determined and highly radical teacher, we follow her on a journey of education and enlightenment as Precious learns not only how to write about her life, but how to make it her own for the first time', 'https://covers.openlibrary.org/b/id/418593-L.jpg', 4.2, 142, 'A1-01', 60000, NOW(), NOW()),
(160, 'C How to Program', 'Paul J. Deitel', 'ISBN-160', 'Unknown Publisher', '2023-01-01', 349, 'C How to Program is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/11603839-L.jpg', 3.6, 197, 'A1-01', 100000, NOW(), NOW()),
(161, 'The Silk Roads', 'Peter Frankopan', 'ISBN-161', 'Unknown Publisher', '2023-01-01', 136, '"Our world was made on and by the Silk Roads. For millennia it was here that East and West encountered each other through trade and conquest, leading to the spread of ideas and cultures, the birth of the world''s great religions, the appetites for foreign goods that drove economies and the growth of nations. From the first cities in Mesopotamia to the growth of Greece and Rome to the depredations by the Mongols and the Black Death to the Great Game and the fall of Communism, the fate of the West has always been inextricably linked to the East. The Silk Roads vividly captures the importance of the networks that crisscrossed the spine of Asia and linked the Atlantic with the Pacific, the Mediterranean with India, America with the Persian Gulf. By way of events as disparate as the American Revolution and the horrific world wars of the twentieth century, Peter Frankopan realigns the world, orientating us eastwards, and illuminating how even the rise of the West 500 years ago resulted from its efforts to gain access to and control these Eurasian trading networks. In an increasingly globalized planet, where current events in Asia and the Middle East dominate the world''s attention, this magnificent work of history is very much a work of our times"--', 'https://covers.openlibrary.org/b/id/8963642-L.jpg', 4.4, 310, 'A1-01', 50000, NOW(), NOW()),
(162, 'Haunted', 'Chuck Palahniuk', 'ISBN-162', 'Unknown Publisher', '2023-01-01', 171, 'See: https://openlibrary.org/works/OL18936W/Haunted', 'https://covers.openlibrary.org/b/id/9035064-L.jpg', 3.5, 499, 'A1-01', 50000, NOW(), NOW()),
(163, 'Zero History', 'William Gibson', 'ISBN-163', 'Unknown Publisher', '2023-01-01', 252, 'Set among London''s dark and tangled streets after the  money-crash , Zero History is a thriller about the hidden webs and patterns that underlie the new century.

Former rock singer Hollis Henry has lost a lot of money in the crash, which means she can''t turn down the offer of a job from Hubertus Bigend, sinister Belgian proprietor of mysterious ad agency Blue Ant. Milgrim is working for Bigend too.

A stylish, gripping technothriller from the multi-million copy bestselling author of *Neuromancer*.', 'https://covers.openlibrary.org/b/id/7072428-L.jpg', 3.7, 249, 'A1-01', 80000, NOW(), NOW()),
(164, 'Insomnia', 'Stephen King', 'ISBN-164', 'Unknown Publisher', '2023-01-01', 125, 'Insomnia is a 1994 horror/fantasy novel by American writer Stephen King. It follows retired widower Ralph Roberts whose increasing insomnia allows him to perceive auras and other hidden things, leading him to join a conflict between the forces of the Purpose and the Random. Like It and Dreamcatcher, the story is set in the fictional town of Derry, Maine. It includes connections to other Stephen King stories, particularly his novel series The Dark Tower.', 'https://covers.openlibrary.org/b/id/7886954-L.jpg', 4.6, 31, 'A1-01', 130000, NOW(), NOW()),
(165, 'Moomin', 'Tove Jansson', 'ISBN-165', 'Unknown Publisher', '2023-01-01', 496, 'The author''s comic strip is published for the first time in North America in the first volume of a proposed multi-volume series designed to reprint the entire strip of the magical world of the author''s creation, the Moomins.', 'https://covers.openlibrary.org/b/id/943964-L.jpg', 4.7, 352, 'A1-01', 90000, NOW(), NOW()),
(166, 'Introduction to Java Programming', 'Y. Daniel Liang', 'ISBN-166', 'Unknown Publisher', '2023-01-01', 499, 'For courses in Java - Introduction to Programming and Object-Oriented Programming, this fifth edition is revised and expanded to include more extensive coverage of advanced Java topics. Early chapters guide students through simple examples and exercises.Subsequent chapters progressively present Java programming in detail.', 'https://covers.openlibrary.org/b/id/85920-L.jpg', 3.6, 168, 'A1-01', 70000, NOW(), NOW()),
(167, 'Learning Python', 'Mark Lutz', 'ISBN-167', 'Unknown Publisher', '2023-01-01', 111, 'Describes the features of the Python 2.5 programming language, covering such topics as types and operations, statements and syntax, functions, modules, classes and OOP, and exceptions and tools.', 'https://covers.openlibrary.org/b/id/1312568-L.jpg', 3.0, 88, 'A1-01', 130000, NOW(), NOW()),
(168, 'Philippine history and government', 'Gregorio F. Zaide', 'ISBN-168', 'Unknown Publisher', '2023-01-01', 330, 'Philippine history and government is a fascinating book covering topics in history.', 'https://covers.openlibrary.org/b/id/11694529-L.jpg', 3.6, 466, 'A1-01', 100000, NOW(), NOW()),
(169, 'She', 'H. Rider Haggard', 'ISBN-169', 'Unknown Publisher', '2023-01-01', 402, 'An enduring adventure yarn set in pre colonial Africa, culminating in the discovery of a lost civilization ruled by a beautiful eternally youthful queen. "She is generally considered to be one of the classics of imaginative literature and with 83 million copies sold by 1965, it is one of the best-selling books of all time." See more at: http://en.wikipedia.org/wiki/She_(novel)', 'https://covers.openlibrary.org/b/id/295537-L.jpg', 4.6, 300, 'A1-01', 60000, NOW(), NOW()),
(170, 'The art of computer programming', 'Donald Knuth', 'ISBN-170', 'Unknown Publisher', '2023-01-01', 397, 'The art of computer programming is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/136600-L.jpg', 4.1, 119, 'A1-01', 50000, NOW(), NOW()),
(171, 'Ἱστορίαι', 'Ἡρόδοτος', 'ISBN-171', 'Unknown Publisher', '2023-01-01', 162, 'One of the earliest histories of the western world still extant, this gives a contemporary account of the Greco-Persian wars of the fifth century BCE with the rise of the Achaemenid Empire under Cyrus the Great.', 'https://covers.openlibrary.org/b/id/9829028-L.jpg', 3.2, 355, 'A1-01', 90000, NOW(), NOW()),
(172, 'Archie Comics Spectacular', 'Archie Superstars', 'ISBN-172', 'Unknown Publisher', '2023-01-01', 475, 'Archie Comics Spectacular is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/8948263-L.jpg', 3.6, 238, 'A1-01', 110000, NOW(), NOW()),
(173, 'Maximum Ride, The Manga 3', 'NaRae Lee', 'ISBN-173', 'Unknown Publisher', '2023-01-01', 451, 'Maximum Ride, The Manga 3 is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/6594075-L.jpg', 4.8, 252, 'A1-01', 90000, NOW(), NOW()),
(174, 'Object-oriented Programming with C++', 'E. Balagurusamy', 'ISBN-174', 'Unknown Publisher', '2023-01-01', 298, 'Object-oriented Programming with C++ is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/10420384-L.jpg', 3.0, 343, 'A1-01', 60000, NOW(), NOW()),
(175, 'The Lessons of History', 'Will Durant', 'ISBN-175', 'Unknown Publisher', '2023-01-01', 356, 'Written by the authors of the 10 volume *The Story of Civilization*, this short (fewer than 120 pages) work notes "events and comments that might illuminate present affairs, future probabilities, the nature of man, and the conduct of states." Its 13 chapters discuss historiography (what is history), history and the earth, history and biology, race, character, morals, religion, economics, socialism, government, war, growth and decay. The final chapter asks, "Is progress real?"', 'https://covers.openlibrary.org/b/id/7240225-L.jpg', 4.3, 174, 'A1-01', 130000, NOW(), NOW()),
(176, 'The History and Culture of Pakistan', 'Nigel Kelly', 'ISBN-176', 'Unknown Publisher', '2023-01-01', 396, 'This book has the overveiw as the short description of the events and the consequences for the creation of Pakistan. This should be read under view that the struggle of jinnah was the main case for the creation of Pakisstan', 'https://covers.openlibrary.org/b/id/6974595-L.jpg', 3.3, 472, 'A1-01', 90000, NOW(), NOW()),
(177, 'Blank Comic Book-Comic Sketch Book', 'Comics', 'ISBN-177', 'Unknown Publisher', '2023-01-01', 242, 'Blank Comic Book-Comic Sketch Book is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/13187802-L.jpg', 4.5, 249, 'A1-01', 100000, NOW(), NOW()),
(178, 'The Program', 'Suzanne Young', 'ISBN-178', 'Unknown Publisher', '2023-01-01', 134, 'In this “gripping tale for lovers of dystopian romance” (Kirkus Reviews), true feelings are forbidden, teen suicide is an epidemic, and the only solution is The Program.

Sloane knows better than to cry in front of anyone. With suicide now an international epidemic, one outburst could land her in The Program, the only proven course of treatment. Sloane’s parents have already lost one child; Sloane knows they’ll do anything to keep her alive. She also knows that everyone who’s been through The Program returns as a blank slate. Because their depression is gone—but so are their memories.

Under constant surveillance at home and at school, Sloane puts on a brave face and keeps her feelings buried as deep as she can. The only person Sloane can be herself with is James. He’s promised to keep them both safe and out of treatment, and Sloane knows their love is strong enough to withstand anything. But despite the promises they made to each other, it’s getting harder to hide the truth. They are both growing weaker. Depression is setting in.

And The Program is coming for them.', 'https://covers.openlibrary.org/b/id/7441541-L.jpg', 4.0, 32, 'A1-01', 100000, NOW(), NOW()),
(179, 'Chemistry', 'Theodore L. Brown', 'ISBN-179', 'Unknown Publisher', '2023-01-01', 342, 'The book provides the basis of modern chemistry that every student needs for their professional development and as preparation for more complex chemistry courses. It also offers features that facilitate learning and serve as a guide for students to acquire a conceptual understanding and the skills needed to solve problems. The first five chapters offer a microscopic and phenomenological view of chemistry, while the latter review the chemistry of nonmetals, metals, organic chemistry and biochemistry.', 'https://covers.openlibrary.org/b/id/9407725-L.jpg', 3.1, 425, 'A1-01', 100000, NOW(), NOW()),
(180, 'At Home', 'Bill Bryson', 'ISBN-180', 'Unknown Publisher', '2023-01-01', 462, 'At Home: A Short History of Private Life is a history of domestic life written by Bill Bryson. It was published in May 2010. The book covers topics of the commerce, architecture, technology and geography that have shaped homes into what they are today, told through a series of "tours" through Bryson''s Norfolk rectory that quickly digress into the history of each particular room.', 'https://covers.openlibrary.org/b/id/8579619-L.jpg', 3.9, 195, 'A1-01', 90000, NOW(), NOW()),
(181, 'Core Python Programming', 'R. Nageswara Rao', 'ISBN-181', 'Unknown Publisher', '2023-01-01', 390, 'Core Python Programming is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/13192647-L.jpg', 4.4, 487, 'A1-01', 50000, NOW(), NOW()),
(182, 'A history of the modern world', 'R. R. Palmer', 'ISBN-182', 'Unknown Publisher', '2023-01-01', 475, 'Conceived and written as a history of the modern world rather than a truncated Western Civilization book, this text is one of the most highly praised history texts ever published. It has been adopted at more than 1000 schools and has been translated into six languages. Lloyd Kramer joins the author team for this ninth edition that includes two new color inserts highlighting fine art, additional pedagogy to guide students through challenging material, and full, up-to-date inclusion of current events.
First published in 1950, translated into six languages, is used in more than 1,000 colleges and universities as well as many high school advanced placement courses. The second edition (1956), comprises two volumes, 20 main chapters and 110 sub-chapters. The author focuses on World History from a European perspective, and the newer editions also exists under the title "A History of Europe in the Modern World".

First book
The Ancient Greece to 1848

Chapter 1 - Birth of Europe
1. Ancient Greece, Rome and Christianity, p. 3
2. Early Middle Ages, Forming of Europe, p. 10
3. High Middle Ages, Profane culture, p. 18
4. High Middle Ages, the Church, p. 29

Chapter 2 - The Upheaval within the Christian Church 1300 - 1560
5. Decay of the Church, p. 39
6. The Renaissance in Italy, p. 44
7. The Renaissance outside Italy, p. 52
8. The new Monarchies, p. 54
9. Protestantism, p. 60
10. Catholic reformation and restructure, p. 73

Chapter 3 - The Religious Wars 1560 - 1648
11. Opening of the Atlantic Ocean, p. 81
12. The Commercial Revolution, p. 85
13. The Spanish Inquisition; the Dutch and the English, p. 95
14. France''s decomposition and reconstruction, p. 104
15. The thirty-year war; Germany''s decay, p. 111

Chapter 4 - Western Europe in Leadership Position
16. The Great Monarch and the Balance in Europe, p. 121
17. The Dutch Republic, p. 124
18. England: the Puritan Republic, p. 129
19. England: the Triumph of the Parliament, p. 136
20. Louis XIV''s France 1643-1715; the Triumph of Absolutism, p. 142
21. Louis XIV''s War; Treaty of Utrecht, p. 152

Chapter 5 - Transformation of Eastern Europe 1648 - 1740
22. Three aging values, p. 159
23. Arising of the Austrian Monarchy, p. 170
24. Origin of Prussia, p. 175
25. Russia''s Transforming into Western Values, p. 175
26. Poland''s divisions, p. 195

Chapter 6 - The Struggle for Wealth and Power
27. The World''s Housekeeping during the 18th Century, p. 200
28. Western Europe after Utrecht, p. 209
29. The Big War in the middle of the 18th Century, p. 219

Chapter 7 - The Scientific perspective of the World
30. The Prophets of Scientific Culture - Bacon and Descartes, p. 234
31. The Road to Newton: Law of Gravitation, p. 239
32. Expanded Knowledge of the Human Being and Society, p. 247
33. Political Theory: the Natural Law School, p. 254

Chapter 8 - Age of Enlightenment
34. "The Philosophers", p. 261
35. Enlightened Despotism, France, Austria, Pussia, p. 272
36. Enlightened Despotism, Russia, p. 282
37. The American Revolution, p. 289

Chapter 9 - The French Revolution
38. Preconditions, p. 303
39. The Revolution 1789, p. 307
40. The French Unity, p. 315
41. The Revolution and Europe: The War and the "second" revolution 1792, p. 320
42. The French Remodeling of Society, p. 315
43. Republican Crisis 1792-95: Reign of Terror, p. 325
44. The Despotic Republic 1799-1804, p. 337

Chapter 10 - The Napoleonic Europe
45. The Creation of the French Empire, p. 345
46. The large Empire: the Propagation of the Revolution, p. 354
47. The Continental System: Britain and Europe, p. 359
48. The National Movements: Germany, p. 364
49. Napoleon defeated: The Vienna Congress, p. 372

Chapter 11 - Reaction versus progress 1815 - 1848
50. The Industrial Revolution, p. 384
51. Origin of the new Ideologies, p. 391
52. The Dam of the River: Domestic Politics, p. 403
53. The Breakthrough of Liberalism in the West: The Revolutions 1830-32, p. 413
54. The triumph of Western Bourgeois, p. 423

Second book
The 1848 Revolutions to the Second World War and its aftermath

Chapter 12 - 1848: An interrupted Revolution
56: Paris: the Ghost of Western Social Revolutions, p. 2
57: Vienna: the National Revolution in Central Europe, p. 9
58: Frankfurt and Berlin: the Question of a Liberal Europe, p. 17
59: The Consequences of the 1848 Revolutions: the hard Objectivity, p. 24
60: Birth of Marxism, p. 27
61: Bonaparteism: The Second French Empire 1852-70, p. 33

Chapter 13 - Consolidation of the large Countries
62: Background: the idea of National States, p. 39
63: Cavour and the Italian War 1859: Italy''s Unification, p. 42
64: Bismarck: the Foundation of the German Empire, p. 47
65: The Double Monarchy Austria-Hungary, p. 56
66: Liberalisation of Tsar-Russia: Alexander II, p. 60
67: United States: The Civil War, p. 65
68: Dominion Canada 1867, p. 71
69: Japan versus the West, p. 74

Chapter 14 - The European Civilization 1871-1914
70: "The Civilized World", p. 82
71: Demographic Basics: The Growth of the European Population, p. 84
72: The World''s Housekeeping during the 19th Century, p. 92
73: Democracy''s progress: Third French Republic, United Kingdom of Great Britain and Ireland, German Empire, p. 100
74: Democracy''s progress: Socialism and Worker''s Unions, p. 112
75: Science, Philosophy and Religion, p. 119
76: The Extinction of Classic Liberalism, p. 129

Chapter 15 - The European World Domination
77: Imperialism: its Nature and Reasons, p. 137
78: America, p. 144
79: The Dissolution of the Ottoman Empire, p. 149
80: Africa''s division, p. 157
81: Imperialism in Asia: the Dutch, the British and the Russians, p. 164
82: Imperialism in Asia: China and the West, p. 168
83: The Russian-Japanese war, p. 172

Chapter 16 - World War One
84: The International Anarchy, p. 175
85: The Battle of Marne and the new Countenance of the War, p. 184
86: Stalemate 1915-1916, the Navy, the Army, Diplomacy, p. 186
87: The Russian Collapse and the United States'' intervention, p. 194
88: The Collapse of the Austrian and German Empires, p. 200
89: The War''s Economical and Social Effects, p. 202
90: The Peace in Paris 1919, p. 206

Chapter 17 - The Russian Revolution
91: Background, p. 216
92: The 1905 Revolution, p. 224
93: The 1917 Revolution, p. 229
94: The Union of the Socialist Soviet Republics, p. 237
95: Stalin: the Five Year Plans and the Cleansings, p. 244
96: The International Effects of Communism, p. 254

Chapter 18 - The apparent victory of democracy
97: Democracy''s advancement and the New Deal, p. 260
98: The German Republic and the Spirit of Locarno, p. 265
99: Asia''s Revolt, p. 272
100: The Great Depression: Collapse of the World''s Housekeeping, p. 284

Chapter 19 - Democracy and Dictatorship
101: The United States: Depression and the New Deal, p. 292
102: Stress and Adaptation for the British and French Democracies, p. 297
103: Totalitarianism: The Italian Fascism, p. 306
104: Totalitarianism: Germany''s Third Reich, p. 311
105: Weakness of the West: Against a New War, p. 323

Chapter 20 - The Earthquake: The Second World War and its Aftermath
106: The Axis Powers'' Triumphs, p. 333
107: The Western Powers'' and Soviet Union''s Victories, p. 341
108: Restructure and Revolution in Europe and Asia after the War, p. 349
109: The Democracies After 1945, p. 358
110: Two Worlds at Conflict, p. 368', 'https://covers.openlibrary.org/b/id/6286058-L.jpg', 3.5, 276, 'A1-01', 50000, NOW(), NOW()),
(183, 'Manga Madness', 'David Okum', 'ISBN-183', 'Unknown Publisher', '2023-01-01', 412, 'Manga is the hottest segment of today''s comic-book market, and this book shows pre-teen and teen fans exactly how to re-create this popular Japanese drawing style in 40 basic lessons.Manga is the hottest segment of today''s comic-book market, and this book shows pre-teen and teen fans exactly how to re-create this popular Japanese drawing style in 40 basic lessons.', 'https://covers.openlibrary.org/b/id/842928-L.jpg', 3.5, 102, 'A1-01', 80000, NOW(), NOW()),
(184, 'Babel', 'R. F. Kuang', 'ISBN-184', 'Unknown Publisher', '2023-01-01', 216, 'From award-winning author R. F. Kuang comes Babel, a thematic response to The Secret History and a tonal retort to Jonathan Strange & Mr. Norrell that grapples with student revolutions, colonial resistance, and the use of language and translation as the dominating tool of the British empire.

Traduttore, traditore: An act of translation is always an act of betrayal.

1828. Robin Swift, orphaned by cholera in Canton, is brought to London by the mysterious Professor Lovell. There, he trains for years in Latin, Ancient Greek, and Chinese, all in preparation for the day he’ll enroll in Oxford University’s prestigious Royal Institute of Translation—also known as Babel.

Babel is the world''s center for translation and, more importantly, magic. Silver working—the art of manifesting the meaning lost in translation using enchanted silver bars—has made the British unparalleled in power, as its knowledge serves the Empire’s quest for colonization.

For Robin, Oxford is a utopia dedicated to the pursuit of knowledge. But knowledge obeys power, and as a Chinese boy raised in Britain, Robin realizes serving Babel means betraying his motherland. As his studies progress, Robin finds himself caught between Babel and the shadowy Hermes Society, an organization dedicated to stopping imperial expansion. When Britain pursues an unjust war with China over silver and opium, Robin must decide…

Can powerful institutions be changed from within, or does revolution always require violence?', 'https://covers.openlibrary.org/b/id/12468631-L.jpg', 3.5, 301, 'A1-01', 70000, NOW(), NOW()),
(185, 'Case Histories', 'Kate Atkinson', 'ISBN-185', 'Unknown Publisher', '2023-01-01', 404, '"Case One: Olivia Land, youngest and most beloved of the Land girls, goes missing in the night and is never seen again. More than thirty years later, two of her surviving sisters, each achingly lonely in her own way, reunite when their cruel and distant father dies. There, among the clutter of their childhood home, they unearth a shocking clue to Olivia''s disappearance." "Case Two: All of Theo''s happiness is tied to his devoted daughter Laura. He delights in her wit, her effortless beauty, and selfless love, and in the fact that she''s taken a position at his prestigious law firm. But on her first day on the job, a maniac storms into the office and turns Theo''s world upside down." "Case Three: Michelle looks around one day and finds herself trapped in a hell of her own making. A very needy baby and a very demanding husband make her every waking moment a reminder that somewhere, somehow, shed made a grave mistake and would spend the rest of her life paying for it - until a fit of rage creates a grisly, bloody escape." "As Private Detective Jackson Brodie investigates all three cases, startling connections and discoveries emerge. Jackson finds himself inextricably caught up in his clients'' lives; their grief, their job, their desire, and their unshakable need for resolution are very much like his own."--BOOK JACKET', 'https://covers.openlibrary.org/b/id/6606671-L.jpg', 5.0, 378, 'A1-01', 120000, NOW(), NOW()),
(186, 'Blaze', 'Stephen King', 'ISBN-186', 'Unknown Publisher', '2023-01-01', 164, 'Blaze is a novel by American writer Stephen King, published under the pseudonym of Richard Bachman. King announced on his website that he "found it" in an attic. As stated in the afterword of Different Seasons, it was written before Carrie. King offered the original draft of the novel to his Doubleday publishers at the same time as ''Salem''s Lot; the latter was chosen to be his second novel and Blaze became a "trunk novel." King rewrote the manuscript, editing out much of what he perceived as over-sentimentality in the original text, and offered the book for publication in 2007.', 'https://covers.openlibrary.org/b/id/14652676-L.jpg', 3.7, 226, 'A1-01', 110000, NOW(), NOW()),
(187, 'The C Programming Language', 'Brian W. Kernighan', 'ISBN-187', 'Unknown Publisher', '2023-01-01', 434, 'Very well known, classic introduction to the C Programming Language. Both a text for learning, a reference, and, to some, the definition of proper C language features and use.', 'https://covers.openlibrary.org/b/id/6684943-L.jpg', 3.1, 405, 'A1-01', 50000, NOW(), NOW()),
(188, 'Extreme programming explained', 'Kent Beck', 'ISBN-188', 'Unknown Publisher', '2023-01-01', 209, '"Extreme Programming (XP) was conceived and developed to address the specific needs of software development conducted by small teams in the face of vague and changing requirements. This new lightweight methodology challenges many conventional tenets, including the long-held assumption that the cost of changing a piece of software necessarily rises dramatically over the course of time.

XP recognizes that projects have to work to achieve this reduction in cost and exploit the savings once they have been earned." "You may love XP or you may hate it, but Extreme Programming Explained will force you to take a fresh look at how you develop software."--BOOK JACKET.', 'https://covers.openlibrary.org/b/id/5394766-L.jpg', 3.2, 60, 'A1-01', 120000, NOW(), NOW()),
(189, 'Art history', 'Marilyn Stokstad', 'ISBN-189', 'Unknown Publisher', '2023-01-01', 168, 'In tune with today''s readers–rich but never effete–this is the art history book of choice for a new generation. Presenting a broad view of art through the centuries, it sympathetically and positively introduces the works of all artists. This includes women, artists of color, and the arts of other continents and regions, as well as those of Western Europe and the United States. The new edition contains even more full-color reproductions, larger images, redrawn maps and timelines, and new photographs and higher quality images. Balancing both the traditions of art history and new trends of the present, Art History is the most comprehensive, accessible, and magnificently illustrated work of its kind. Broad in scope and depth, this beautifully illustrated work features art from the following time periods and places: prehistoric art in Europe; ancient art of the Near East, Egypt, the Aegean, and Greece; Roman and Etruscan art; Jewish, early Christian, and Byzantine art; Islamic art; art from ancient India, China, Japan, and the Americas; medieval art in Europe; Romanesque, Gothic, and Renaissance art; Baroque art; art of the Pacific cultures; the rise of modern art; and the international Avant-Garde since 1945. An excellent reference work and beautiful edition for any visual artist.', 'https://covers.openlibrary.org/b/id/596109-L.jpg', 3.2, 451, 'A1-01', 80000, NOW(), NOW()),
(190, 'A History of Western Philosophy', 'Bertrand Russell', 'ISBN-190', 'Unknown Publisher', '2023-01-01', 409, '[The author''s] purpose is to exhibit philosophy as an integral part of social and political life: not as the isolated speculations of remarkable individuals, but as both an effect and a cause of the character of the various communities in which different systems flourished.-Pref.', 'https://covers.openlibrary.org/b/id/405359-L.jpg', 3.2, 490, 'A1-01', 50000, NOW(), NOW()),
(191, 'Stoner', 'John Williams', 'ISBN-191', 'Unknown Publisher', '2023-01-01', 164, 'William Stoner is born at the end of the nineteenth century into a dirt-poor Missouri farming family. Sent to the state university to study agronomy, he instead falls in love with English literature and embraces a scholar’s life, so different from the hardscrabble existence he has known. And yet as the years pass, Stoner encounters a succession of disappointments: marriage into a “proper” family estranges him from his parents; his career is stymied; his wife and daughter turn coldly away from him; a transforming experience of new love ends under threat of scandal. Driven ever deeper within himself, Stoner rediscovers the stoic silence of his forebears and confronts an essential solitude.

John Williams’s luminous and deeply moving novel is a work of quiet perfection. William Stoner emerges from it not only as an archetypal American, but as an unlikely existential hero, standing, like a figure in a painting by Edward Hopper, in stark relief against an unforgiving world. **Stoner pdf**', 'https://covers.openlibrary.org/b/id/8310729-L.jpg', 4.2, 478, 'A1-01', 70000, NOW(), NOW()),
(192, 'Eleven Minutes', 'Paulo Coelho', 'ISBN-192', 'Unknown Publisher', '2023-01-01', 152, 'Eleven Minutes is the story of Maria, a young girl from a Brazilian village, whose first innocent brushes with love leave her heartbroken. At a tender age, she becomes convinced that she will never find true love, instead believing that "love is a terrible thing that will make you suffer. . . ." A chance meeting in Rio takes her to Geneva, where she dreams of finding fame and fortune. Maria''s despairing view of love is put to the test when she meets a handsome young painter. In this odyssey of self-discovery, Maria has to choose between pursuing a path of darkness — sexual pleasure for its own sake — or risking everything to find her own "inner light" and the possibility of sacred sex, sex in the context of love.This P.S. edition features an extra 16 pages of insights into the book, including author interviews, recommended reading, and more.', 'https://covers.openlibrary.org/b/id/31228-L.jpg', 4.9, 356, 'A1-01', 80000, NOW(), NOW()),
(193, 'History of the Filipino People', 'Teodoro A. Agoncillo', 'ISBN-193', 'Unknown Publisher', '2023-01-01', 399, 'Comprehensive overview of Philippine History including Pre-Spanish life and culture, Spanish rule, the Filipino -American War, American rule, and the campaign for Independence, among other subjects.', 'https://covers.openlibrary.org/b/id/6682021-L.jpg', 3.8, 226, 'A1-01', 90000, NOW(), NOW()),
(194, 'Manga! Manga!', 'Frederik L. Schodt', 'ISBN-194', 'Unknown Publisher', '2023-01-01', 229, 'Manga in Japanese means "comics," and comics in Japan are simply the most marvelous multifaceted misunderstood mass-market monster publishing phenomenon ever, anywhere. A multibillion dollar industry ... tens of millions of devoted fans ... thousands of ceaselessly toiling artists, a few of whom grow fabulously wealthy. There''s something for everyone, too, from historical romances set in the French revolution and bloody duels between medieval samurai, to tales of wrestlers, enlightened Buddhist sages, spacemen, anthropomorphic cats, gangsters, girls in and out of love, warrior robots, sushi-makers, and even the tireless Mr. Nobody at the office, the esteemed soldier in Japan''s economic-miracle army. Until now, this world has been hardly remarked upon by Western observers, except for mention of the fact that on trains, in restaurants, and indeed at every leisure moment the Japanese seem to have their heads buried in comics. But with this book Japanese comics emerge in all their spectacular variety for the first time in English. Author Fred Schodt offers a wealth of highlights and sidelights into history, themes, and artists. And every page is chock-full of samples from Japanese comic magazines. Here is popular culture running at a high pitch, and outsiders might find it all a bit puzzling and perverse. So if you''re a bit straitlaced take it slow. But if your assumptions about comics are open to challenge, or if you thought you knew the real Japan because you''ve read all about Zen and the tea ceremony and Theory Z, read on, read on.', 'https://covers.openlibrary.org/b/id/4787783-L.jpg', 3.0, 302, 'A1-01', 130000, NOW(), NOW()),
(195, 'History of architecture', 'Fletcher, Banister Sir', 'ISBN-195', 'Unknown Publisher', '2023-01-01', 433, 'A History of Architecture is the first major work of history to include an overview of the architectural achievements of the 20th Century. Banister Fletcher has been the standard one volume architectural history for over 100 years and continues to give a concise and factual account of world architecture from the earliest times. In this twentieth and centenary edition, edited by Dan Cruickshank with three consultant editors and fourteen new contributors, chapters have been recast and expanded and a third of the text is new. There are new chapters on the twentieth-century architecture of the Middle East (including Israel), South-east Asia, Hong Kong, Japan and Korea, the Indian subcontinent, Russia and the Soviet Union, Eastern Europe and Latin America. The book''s scope has been widened to include more architecture from non European countries and coverage of pre twentieth century architecture now includes 6 chapters on Islam.

For the first time in Banister Fletcher''s A History of Architecture the architecture of the20th century is considered as a whole and assessed in a historical perspective. There is more information on vernacular buildings and engineered structures as well as many new plans and sections. This unique reference book places buildings in their social, cultural and historical settings to describe the main patterns of architectural development, from Prehistoric to the International Style. Again in the words of Sir Banister Fletcher, this book shows that ''Architecture ... provides a key to the habits, thoughts and aspirations of the people, and without a knowledge of this art the history of any period lacks that human interest with which it should be invested.'' Winner of the International Architecture Book Award, The American Institute of Architects Book of the Century. THE source book for the historical development of architecture. Publisher''s description.', 'https://covers.openlibrary.org/b/id/493320-L.jpg', 4.9, 170, 'A1-01', 80000, NOW(), NOW()),
(196, 'How to Draw Manga', 'Hikaru Hayashi', 'ISBN-196', 'Unknown Publisher', '2023-01-01', 260, 'How to Draw Manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/4965721-L.jpg', 3.3, 130, 'A1-01', 140000, NOW(), NOW()),
(197, 'Microprocessors and interfacing', 'Douglas V. Hall', 'ISBN-197', 'Unknown Publisher', '2023-01-01', 490, 'This text focuses on the Intel 8086 family that are used in the IBM PC''s and teaches students the programming, system connections, and interfacing of microprocessors and their peripheral devices in detail. Students begin with a brief introduction to computer hardware which leads to an in-depth look at how microprocessor-based computers are programmed to do real tasks. They also cover assembly language programming of 8086-based systems. Throughout the text, the emphasis is on writing assembly language programs in a top-down, structured manner. Included are comparisons between CISC and RISC microcomputer architectures and their trade-offs.', 'https://covers.openlibrary.org/b/id/9089229-L.jpg', 4.7, 469, 'A1-01', 130000, NOW(), NOW()),
(198, 'Historical Atlas of the World', 'History', 'ISBN-198', 'Unknown Publisher', '2023-01-01', 272, 'Historical Atlas of the World is a fascinating book covering topics in history.', 'https://covers.openlibrary.org/b/id/4617698-L.jpg', 3.5, 329, 'A1-01', 90000, NOW(), NOW()),
(199, 'Archie comics spectacular', 'Archie Superstars Staff', 'ISBN-199', 'Unknown Publisher', '2023-01-01', 147, 'Archie comics spectacular is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/12488811-L.jpg', 3.4, 263, 'A1-01', 80000, NOW(), NOW()),
(200, 'The Lost Warrior', 'Erin Hunter', 'ISBN-200', 'Unknown Publisher', '2023-01-01', 361, 'When the Twolegs destroy the warrior Clans'' forest home, Graystripe—second in command of ThunderClan is captured trying to help his comrades escape! Trapped in the pampered life of a kittypet, Graystripe has all the food and shelter he needs from his affectionate Twoleg family, but this is not the way he wants to live. The forest is calling him, and he never stops longing to go home. When he makes friends with a feisty kittypet named Millie, she encourages him to go in search of his lost friends. But will Graystripe ever find his way back to the Clan?


----------
**Books in this series**

 1. The Lost Warrior
 2. [Warrior''s Refuge][2]
 3. [Warrior''s Return][3]

  [2]: https://openlibrary.org/works/OL6043966W
  [3]: https://openlibrary.org/works/OL6043965W', 'https://covers.openlibrary.org/b/id/9395478-L.jpg', 3.3, 36, 'A1-01', 80000, NOW(), NOW()),
(201, 'Programming with Java', 'E. Balagurusamy', 'ISBN-201', 'Unknown Publisher', '2023-01-01', 246, 'Programming with Java is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/10487733-L.jpg', 4.9, 68, 'A1-01', 140000, NOW(), NOW()),
(202, 'Salt', 'Mark Kurlansky', 'ISBN-202', 'Unknown Publisher', '2023-01-01', 499, 'Mark Kurlansky''s books Cod & Salt are the musts for every student on food studies.  Together they supply the missing link of knowledge.  One or two semesters courses are recommended for beginners in cod and salt studies.', 'https://covers.openlibrary.org/b/id/6873606-L.jpg', 3.1, 17, 'A1-01', 100000, NOW(), NOW()),
(203, 'How to Draw Manga', 'Manga University', 'ISBN-203', 'Unknown Publisher', '2023-01-01', 241, 'How to Draw Manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/10833240-L.jpg', 4.5, 263, 'A1-01', 70000, NOW(), NOW()),
(204, 'Beautiful creatures', 'Cassandra Jean', 'ISBN-204', 'Unknown Publisher', '2023-01-01', 391, 'In a graphic novel adaptation of the book Beautiful creatures, sixteen-year-old Ethan is powerfully drawn to Lena, a new classmate with whom he shares a psychic connection and whose family hides a dark secret that may be revealed on her sixteenth birthday.

This graphic-novel adaptation tells the story of sixteen-year-old Ethan''s powerful attaction to Lena, the new girl at his rural South Carolina high school, with whom he shares a psychic connection. The coauthor is Margaret Stohl.', 'https://covers.openlibrary.org/b/id/9982577-L.jpg', 3.4, 418, 'A1-01', 60000, NOW(), NOW()),
(205, 'The Secret History', 'Donna Tartt', 'ISBN-205', 'Unknown Publisher', '2023-01-01', 356, 'Under the influence of their charismatic classics professor, a group of clever, eccentric misfits at an elite New England college discover a way of thinking and living that is a world away from the humdrum existence of their contemporaries. But when they go beyond the boundaries of normal morality they slip gradually from obsession to corruption and betrayal, and at last - inexorably - into evil.', 'https://covers.openlibrary.org/b/id/744854-L.jpg', 4.3, 382, 'A1-01', 100000, NOW(), NOW()),
(206, 'Manga Classics', 'William Shakespeare', 'ISBN-206', 'Unknown Publisher', '2023-01-01', 402, 'Manga Classics is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/13851286-L.jpg', 3.5, 461, 'A1-01', 130000, NOW(), NOW()),
(207, 'Structure and Interpretation of Computer Programs (SICP)', 'Harold Abelson', 'ISBN-207', 'Unknown Publisher', '2023-01-01', 212, '> **Wizard Book** n. Hal Abelson''s, Jerry Sussman''s and Julie Sussman''s Structure and Interpretation of Computer Programs (MIT Press, 1984; ISBN 0-262-01077-1), an excellent computer science text used in introductory courses at MIT. So called because of the wizard on the jacket. One of the bibles of the LISP/Scheme world. Also, less commonly, known as the Purple Book.

*from The New Hacker''s Dictionary, 2nd edition (MIT Press, 1993)*', 'https://covers.openlibrary.org/b/id/149338-L.jpg', 3.8, 465, 'A1-01', 100000, NOW(), NOW()),
(208, 'Programming Perl', 'Larry Wall', 'ISBN-208', 'Unknown Publisher', '2023-01-01', 495, '<h2>Pringing History</h2>
<dl> 
<dt>January 1991</dt>
<dd>First Edition.</dd> 
<dt>August 1991</dt>
<dd>Minor Corrections.</dd> 
<dt>March 1992</dt>
<dd>Minor Corrections.</dd> 
<dt>September 1996</dt>
<dd>Second Edition.</dd> 
<dt>July 2000</dt>
<dd>Third Edition.</dd> 
</dl>', 'https://covers.openlibrary.org/b/id/715250-L.jpg', 4.3, 13, 'A1-01', 100000, NOW(), NOW()),
(209, 'Maskerade', 'Terry Pratchett', 'ISBN-209', 'Unknown Publisher', '2023-01-01', 460, 'The story begins with Agnes Nitt leaving Lancre to seek a career at the Opera House in Ankh-Morpork. When Granny Weatherwax realizes Nanny Ogg has written an immensely popular cookbook but has not been paid by the publisher, the witches also leave for Ankh-Morpork to collect the money, as well as to attempt to recruit Agnes into their coven, to replace Magrat Garlick who left the coven when she became Queen of Lancre (in Lords and Ladies). This has the side benefit of distracting Granny from becoming obsessive and self-centered, or so Nanny believes to her great relief. Agnes Nitt is chosen as a member of the chorus, where she meets Christine, a more popular but less talented girl. The Opera House Ghost, who has long haunted the opera house without much incident, begins to commit seemingly random murders staged as "accidents", and also requests that Christine be given lead roles in several upcoming productions. Due to her incredibly powerful and versatile voice, Agnes is asked to sing the parts from the background, unbeknownst to Christine or the audience. Having discovered the problems at the opera house and also having coerced the publisher to pay Nanny richly for her book, the witches investigate the mystery, with Granny posing as a rich patron, and Nanny insinuating herself into the opera house staff. Agnes unmasks Walter Plinge, the janitor, as the ghost, though as he is seemingly harmless, the others are unconvinced. Another employee is suspected, but turns out to be a member of the Cable Street Particulars. The witches determine that the finances of the Opera House, which are a complete mess, have been made so intentionally in order to hide the fact that money is being stolen, with the murders being used either as a distraction or to cover evidence. It is finally revealed that two people had been masquerading as the ghost. The original (and harmless) ghost, Walter Plinge, was being psychologically manipulated by the second ghost, who assumed the identity to commit the murders and theft. With the witches'' help, Walter is able to overcome his fears and help defeat the murderer. - Wikipedia.', 'https://covers.openlibrary.org/b/id/14646574-L.jpg', 3.4, 187, 'A1-01', 80000, NOW(), NOW()),
(210, 'Understanding Comics', 'Scott McCloud', 'ISBN-210', 'Unknown Publisher', '2023-01-01', 211, 'Praised throughout the cartoon industry by such luminaries as Art Spiegelman, Matt Groening, and Will Eisner, Scott McCloud''s Understanding Comics is a seminal examination of comics art: its rich history, surprising technical components, and major cultural significance. Explore the secret world between the panels, through the lines, and within the hidden symbols of a powerful but misunderstood art form.', 'https://covers.openlibrary.org/b/id/10679940-L.jpg', 4.8, 223, 'A1-01', 60000, NOW(), NOW()),
(211, 'The now habit', 'Neil Fiore', 'ISBN-211', 'Unknown Publisher', '2023-01-01', 346, 'Originally published by Tarcher in 1988, The Now Habit has sold more than 58,000 copies, and is as relevant as ever!Author Neil Fiore offers the first comprehensive strategy to overcome the causes of procrastination and to eliminate its deleterious effects. His techniques will help any busy person get more things done more quickly, without the anxiety and stress brought on by failure to meet the workplace''s pressing deadlines.This revised, redesigned edition includes a new introduction and a section that provides strategies to understand and deal with the complex role technology plays in procrastination today.', 'https://covers.openlibrary.org/b/id/8231849-L.jpg', 4.0, 236, 'A1-01', 80000, NOW(), NOW()),
(212, 'Maximum Ride. The Manga, Vol. 4', 'NaRae Lee', 'ISBN-212', 'Unknown Publisher', '2023-01-01', 431, 'Maximum Ride. The Manga, Vol. 4 is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/8369830-L.jpg', 3.4, 91, 'A1-01', 100000, NOW(), NOW()),
(213, 'The Clique', 'Lisi Harrison', 'ISBN-213', 'Unknown Publisher', '2023-01-01', 349, 'Claire Lyons is the new girl at Octavian Country Day School, an exclusive private school in Westchester County, New York. But Claire is totally unprepared for the social (and fashion) demands of her new classmates. To make matters worse, Claire''s family is living in the guesthouse of one Massie Block, the queen supreme of her new school! And Massie couldn''t be less thrilled with the new squatter on her family''s estate. Does Claire have what it takes to go toe-to-toe with the "it" girl in her school?', 'https://covers.openlibrary.org/b/id/8185933-L.jpg', 4.6, 450, 'A1-01', 120000, NOW(), NOW()),
(214, 'The Bachman Books (Long Walk / Rage / Roadwork / Running Man)', 'Stephen King', 'ISBN-214', 'Unknown Publisher', '2023-01-01', 457, 'Omnibus collection of four early Bachman novels ([Rage][1], [The Long Walk][2], [Roadwork][3], [The Running Man][4]) and the essay "Why I Was Bachman"
([source][5])


  [1]: https://openlibrary.org/works/OL149154W/Rage
  [2]: https://openlibrary.org/works/OL14917769W/The_Long_Walk
  [3]: https://openlibrary.org/works/OL149156W/Roadwork
  [4]: https://openlibrary.org/works/OL149188W/The_Running_Man
  [5]: https://stephenking.com/library/bachman_novel/bachman_books_the.html', 'https://covers.openlibrary.org/b/id/8565607-L.jpg', 3.2, 218, 'A1-01', 50000, NOW(), NOW()),
(215, 'Drama', 'Raina Telgemeier', 'ISBN-215', 'Unknown Publisher', '2023-01-01', 360, 'Callie loves theater. And while she would totally try out for her middle school''s production of Moon over Mississippi, she can''t really sing. Instead she''s the set designer for the drama department''s stage crew, and this year she''s determined to create a set worthy of Broadway on a middle-school budget. But how can she, when she doesn''t know much about carpentry, ticket sales are down, and the crew members are having trouble working together? Not to mention the onstage AND offstage drama that occurs once the actors are chosen. And when two cute brothers enter the picture, things get even crazier!', 'https://covers.openlibrary.org/b/id/12360868-L.jpg', 4.2, 300, 'A1-01', 120000, NOW(), NOW()),
(216, 'Comics & sequential art', 'Will Eisner', 'ISBN-216', 'Unknown Publisher', '2023-01-01', 341, 'From the Publisher: A classic drawing textbook from an American comics pioneer, revised and enhanced for a new generation. Based on Will Eisner''s legendary course at New York''s School of Visual Arts, this guide has inspired generations of artists, students, teachers, and fans. In Comics and Sequential Art, Eisner reveals the basic building blocks and principles of comics, including imagery, the frame, and the application of time, space, and visual forms. With examples from Eisner''s own catalog and such masters as H. Foster, R. Crumb, Art Spiegelman, Milton Caniff, Al Capp, and George Herriman, this book distills the art of graphic storytelling into principles that every comic artist, writer, and filmmaker should know. 2-color art and text.', 'https://covers.openlibrary.org/b/id/4152446-L.jpg', 3.4, 305, 'A1-01', 120000, NOW(), NOW()),
(217, 'The Spanish Love Deception', 'Elena Armas', 'ISBN-217', 'Unknown Publisher', '2023-01-01', 211, 'Catalina Martín desperately needs a date to her sister’s wedding. Especially since her little white lie about her American boyfriend has spiralled out of control. Now everyone she knows—including her ex and his fiancée—will be there and eager to meet him.

She only has four weeks to find someone willing to cross the Atlantic and aid in her deception. New York to Spain is no short flight and her raucous family won’t be easy to fool.

Enter Aaron Blackford—her tall, handsome, condescending colleague—who surprisingly offers to step in. She’d rather refuse; never has there been a more aggravating, blood-boiling, and insufferable man.

But Catalina is desperate, and as the wedding draws nearer, Aaron looks like her best option. And she begins to realize he might not be as terrible in the real world as he is at the office.', 'https://covers.openlibrary.org/b/id/14425253-L.jpg', 4.1, 266, 'A1-01', 120000, NOW(), NOW()),
(218, 'Making Money', 'Terry Pratchett', 'ISBN-218', 'Unknown Publisher', '2023-01-01', 209, 'The Ankh-Morpork Post Office is running like . . . well, not at all like a government office. The mail is delivered promptly; meetings start and end on time; five out of six letters relegated to the Blind Letter Office ultimately wend their way to the correct addresses. Postmaster General Moist von Lipwig, former arch-swindler and confidence man, has exceeded all expectations—including his own. So it''s somewhat disconcerting when Lord Vetinari summons Moist to the palace and asks, "Tell me, Mr. Lipwig, would you like to make some real money?"Vetinari isn''t talking about wages, of course. He''s referring, rather, to the Royal Mint of Ankh-Morpork, a venerable institution that haas run for centuries on the hereditary employment of the Men of the Sheds and their loyal outworkers, who do make money in their spare time. Unfortunately, it costs more than a penny to make a penny, so the whole process seems somewhat counterintuitive.Next door, at the Royal Bank, the Glooper, an "analogy machine," has scientifically established that one never has quite as much money at the end of the week as one thinks one should, and the bank''s chairman, one elderly Topsy (nee Turvy) Lavish, keeps two loaded crossbows at her desk. Oh, and the chief clerk is probably a vampire.But before Moist has time to fully consider Vetinari''s question, fate answers it for him. Now he''s not only making money, but enemies too; he''s got to spring a prisoner from jail, break into his own bank vault, stop the new manager from licking his face, and, above all, find out where all the gold has gone—otherwise, his life in banking, while very exciting, is going to be really, really short. . . .', 'https://covers.openlibrary.org/b/id/14645701-L.jpg', 4.0, 263, 'A1-01', 140000, NOW(), NOW()),
(219, 'Draw Your Own Manga', 'Haruno Nagatomo', 'ISBN-219', 'Unknown Publisher', '2023-01-01', 167, 'Draw Your Own Manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/3290456-L.jpg', 4.1, 240, 'A1-01', 140000, NOW(), NOW()),
(220, 'Big Nate and friends', 'Lincoln Pierce', 'ISBN-220', 'Unknown Publisher', '2023-01-01', 373, 'Collects sixth-grader Nate Wright''s adventures with his best friends, Francis and Teddy, exchange student, Artur, and annoying teacher''s pet, Gina.', 'https://covers.openlibrary.org/b/id/7876998-L.jpg', 4.6, 241, 'A1-01', 60000, NOW(), NOW()),
(221, 'Microprocessor Architecture, Programming, and Applications with the 8085', 'Ramesh S. Gaonkar', 'ISBN-221', 'Unknown Publisher', '2023-01-01', 178, 'Microprocessor Architecture, Programming, and Applications with the 8085 is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/3807360-L.jpg', 4.0, 393, 'A1-01', 70000, NOW(), NOW()),
(222, 'The Walking Dead, Vol. 1', 'Robert Kirkman', 'ISBN-222', 'Unknown Publisher', '2023-01-01', 363, 'The world we knew is gone. The world of commerce and frivolous necessity has been replaced by a world of survival and responsibility. An epidemic of apocalyptic proportions has swept the globe, causing the dead to rise and feed on the living. In a matter of months society has crumbled: no government, no grocery stores, no mail delivery, no cable TV. In a world ruled by the dead, the survivors are forced to finally start living.', 'https://covers.openlibrary.org/b/id/844763-L.jpg', 5.0, 204, 'A1-01', 70000, NOW(), NOW()),
(223, 'The C++ programming language', 'Bjarne Stroustrup', 'ISBN-223', 'Unknown Publisher', '2023-01-01', 134, 'The C++ Programming tome, written by the father of C++ himself, Bjarne Stroustrup.  The premier book on the subject of C++ Programming.', 'https://covers.openlibrary.org/b/id/136583-L.jpg', 3.2, 372, 'A1-01', 100000, NOW(), NOW()),
(224, 'Mort', 'Terry Pratchett', 'ISBN-224', 'Unknown Publisher', '2023-01-01', 131, 'Death takes on an apprentice who''s an individual thinker.', 'https://covers.openlibrary.org/b/id/14648805-L.jpg', 3.7, 217, 'A1-01', 90000, NOW(), NOW()),
(225, 'Naruto 5', 'Masashi Kishimoto', 'ISBN-225', 'Unknown Publisher', '2023-01-01', 446, 'When Naruto sees Sasuke dead, he realizes that ninjas are weapons and are trained to kill. His rage fuels the fox spirit within him and allows him to beat Haku and avenge Sasuke.', 'https://covers.openlibrary.org/b/id/765214-L.jpg', 4.1, 252, 'A1-01', 60000, NOW(), NOW()),
(226, 'C++ how to program', 'Harvey M. Deitel', 'ISBN-226', 'Unknown Publisher', '2023-01-01', 284, 'El uso de las computadoras se esta incrementando en casi cualquier campo de trabajo. Los costos de las computado-ras se han reducido en forma dramatica, debido al rapido desarrollo en la tecnologia de hardware y software. Las compu-tadoras que ocupaban grandes habitaciones y que costaban millones de dolares, hace algunas decadas, ahora pueden colocarse en las super cies de chips de silicio mas pequenos que una una, y con un costo de quiza unos cuantos dolares cada uno. (A esas enormes computadoras se les llamaba mainframes, y hoy en dia se utilizan ampliamente versiones actualizadas en los negocios, el gobierno y la industria.) Por fortuna, el silicio es uno de los materiales mas abundantes en el planeta (es uno de los ingredientes de la tierra comun). La tecnologia de los chips de silicio ha vuelto tan economica a la tecnologia de la computacion que cientos de millones de computadoras de uso general se encuentran actualmente ayudando a la gente de todo el mundo en empresas, en la industria, en el gobierno y en sus vidas. A traves de los anos, muchos programadores aprendieron la metodologia de programacion conocida como progra-macion estructurada. Usted aprendera tanto la programacion estructurada como la novedosa y excitante metodologia de la programacion orientada a objetos. ¿Por que ensenamos ambas? La orientacion a objetos es la metodologia clave de programacion utilizada hoy en dia por los programadores. Usted creara y trabajara con muchos objetos de software en este libro. Sin embargo, descubrira que la estructura interna de estos objetos se construye, a menudo, utilizando tecnicas de programacion estructurada. Ademas, la logica requerida para manipular objetos se expresa algunas veces mediante la programacion estructurada.', 'https://covers.openlibrary.org/b/id/15111375-L.jpg', 4.6, 503, 'A1-01', 110000, NOW(), NOW()),
(227, 'America', 'George Brown Tindall', 'ISBN-227', 'Unknown Publisher', '2023-01-01', 145, 'Used by over one million students, America: A Narrative History is one of the most successful American history textbooks ever published. Offering a comprehensive introduction to the history of the United States, this work provides wide coverage of social and cultural history. The authors look at how colonial taverns not only served as places to socialize but also became hotbeds for political action before the American Revolution; they explore how the rise of baseball served to equalize whites of different classes but exacerbated racial tension through segregated leagues; and they explore the rise of rock and roll and the "youth culture" of the 1950s as a reaction to the conservative culture.', 'https://covers.openlibrary.org/b/id/253170-L.jpg', 3.6, 254, 'A1-01', 140000, NOW(), NOW()),
(228, 'Reinventing Comics', 'Scott McCloud', 'ISBN-228', 'Unknown Publisher', '2023-01-01', 485, 'Reinventing Comics is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/41821-L.jpg', 4.0, 496, 'A1-01', 50000, NOW(), NOW()),
(229, 'Programming in ANSI C', 'E. Balagurusamy', 'ISBN-229', 'Unknown Publisher', '2023-01-01', 306, 'Programming in ANSI C is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/12597885-L.jpg', 3.7, 447, 'A1-01', 50000, NOW(), NOW()),
(230, 'Berserk', 'Cartoch Arts', 'ISBN-230', 'Unknown Publisher', '2023-01-01', 325, 'Berserk is a fascinating book covering topics in manga.', 'https://via.placeholder.com/150x200?text=No+Cover', 4.4, 433, 'A1-01', 90000, NOW(), NOW()),
(231, 'A short history of nearly everything', 'Bill Bryson', 'ISBN-231', 'Unknown Publisher', '2023-01-01', 257, 'A Short History of Nearly Everything by American author Bill Bryson is a popular science book that explains some areas of science, using easily accessible language that appeals more so to the general public than many other books dedicated to the subject. It was one of the bestselling popular science books of 2005 in the United Kingdom, selling over 300,000 copies.

A Short History deviates from Bryson''s popular travel book genre, instead describing general sciences such as chemistry, paleontology, astronomy, and particle physics. In it, he explores time from the Big Bang to the discovery of quantum mechanics, via evolution and geology.

Bill Bryson wrote this book because he was dissatisfied with his scientific knowledge—that was, not much at all. He writes that science was a distant, unexplained subject at school. Textbooks and teachers alike did not ignite the passion for knowledge in him, mainly because they never delved in the whys, hows, and whens.

The ebook can be found elsewhere on the web at:
http://www.huzheng.org/bookstore/AShortHistoryofNearlyEverything.pdf', 'https://covers.openlibrary.org/b/id/12725620-L.jpg', 4.7, 84, 'A1-01', 140000, NOW(), NOW()),
(232, 'Purple Hibiscus', 'Chimamanda Ngozi Adichie', 'ISBN-232', 'Unknown Publisher', '2023-01-01', 259, 'A book about a flower thing', 'https://covers.openlibrary.org/b/id/12063933-L.jpg', 3.5, 482, 'A1-01', 120000, NOW(), NOW()),
(233, 'Hellsing', 'Kohta Hirano', 'ISBN-233', 'Unknown Publisher', '2023-01-01', 309, 'The Hellsing organization is embattled and London is falling to Nazi vampire forces. It seems to be the end of Integra Wingates Hellsing and her henchman--until The Vatican steps in.', 'https://covers.openlibrary.org/b/id/869389-L.jpg', 3.4, 271, 'A1-01', 140000, NOW(), NOW()),
(234, 'Are you my mother?', 'Alison Bechdel', 'ISBN-234', 'Unknown Publisher', '2023-01-01', 327, 'From the best-selling author of Fun Home, Time magazine’s No. 1 Book of the Year, a brilliantly told graphic memoir of Alison Bechdel becoming the artist her mother wanted to be.

Alison Bechdel’s Fun Home was a pop culture and literary phenomenon. Now, a second thrilling tale of filial sleuthery, this time about her mother: voracious reader, music lover, passionate amateur actor. Also a woman, unhappily married to a closeted gay man, whose artistic aspirations simmered under the surface of Bechdel''s childhood . . . and who stopped touching or kissing her daughter good night, forever, when she was seven. 

Poignantly, hilariously, Bechdel embarks on a quest for answers concerning the mother-daughter gulf. It''s a richly layered search that leads readers from the fascinating life and work of the iconic twentieth-century psychoanalyst Donald Winnicott, to one explosively illuminating Dr. Seuss illustration, to Bechdel’s own (serially monogamous) adult love life. And, finally, back to Mother—to a truce, fragile and real-time, that will move and astonish all adult children of gifted mothers.', 'https://covers.openlibrary.org/b/id/7246401-L.jpg', 4.0, 284, 'A1-01', 70000, NOW(), NOW()),
(235, 'Louis Riel', 'Chester Brown', 'ISBN-235', 'Unknown Publisher', '2023-01-01', 495, '"This award-winning Canadian bestseller tells the story of the charismatic, and perhaps mad, nineteenth century Métis leader, whose struggle to win rights for his people led to violent rebellion on the nation''s western frontier"--P. [4] of cover.', 'https://covers.openlibrary.org/b/id/943967-L.jpg', 3.2, 432, 'A1-01', 110000, NOW(), NOW()),
(236, 'Confess', 'Colleen Hoover', 'ISBN-236', 'Unknown Publisher', '2023-01-01', 351, 'At age twenty-one, Auburn Reed has already lost everything important to her. In her fight to rebuild her shattered life, she has her goals in sight and there is no room for mistakes. But when she walks into a Dallas art studio in search of a job, she doesn''t expect to find a deep attraction to the enigmatic artist who works there, Owen Gentry.  For once, Auburn takes a chance and puts her heart in control, only to discover that Owen is keeping a major secret from coming out. The magnitude of his past threatens to destroy everything important to Auburn, and the only way to get her life back on track is to cut Owen out of it. To save their relationship, all Owen needs to do is confess. But in this case, the confession could be much more destructive than the actual sin.', 'https://covers.openlibrary.org/b/id/14418402-L.jpg', 4.0, 81, 'A1-01', 100000, NOW(), NOW()),
(237, 'Eloquent Javascript', 'Marijn Haverbeke', 'ISBN-237', 'Unknown Publisher', '2023-01-01', 153, '"*Eloquent JavaScript* is a book providing an introduction to the JavaScript programming language and programming in general."', 'https://covers.openlibrary.org/b/id/7082166-L.jpg', 4.4, 241, 'A1-01', 90000, NOW(), NOW()),
(238, 'The Enduring Vision', 'Paul S. Boyer', 'ISBN-238', 'Unknown Publisher', '2023-01-01', 350, 'Widely admired for its outstanding scholarship and engaging narrative, The Enduring Vision integrates political, social, and cultural history within a clear chronological framework. It was the first U.S. history textbook to incorporate sustained attention to cultural history, the West, and the environment. The Fifth Edition maintains these strengths as well as the book''s distinctive focus on the enduring vision of the American people, "the determination to live up to the values that give meaning to America." - Back cover.', 'https://covers.openlibrary.org/b/id/8237922-L.jpg', 3.1, 287, 'A1-01', 90000, NOW(), NOW()),
(239, 'Little Fires Everywhere', 'Celeste Ng', 'ISBN-239', 'Unknown Publisher', '2023-01-01', 386, 'In Shaker Heights, a placid, progressive suburb of Cleveland, everything is planned – from the layout of the winding roads, to the colors of the houses, to the successful lives its residents will go on to lead. And no one embodies this spirit more than Elena Richardson, whose guiding principle is playing by the rules.

Enter Mia Warren – an enigmatic artist and single mother – who arrives in this idyllic bubble with her teenaged daughter Pearl, and rents a house from the Richardsons. Soon Mia and Pearl become more than tenants: all four Richardson children are drawn to the mother-daughter pair. But Mia carries with her a mysterious past and a disregard for the status quo that threatens to upend this carefully ordered community.

When old family friends of the Richardsons attempt to adopt a Chinese-American baby, a custody battle erupts that dramatically divides the town--and puts Mia and Elena on opposing sides.  Suspicious of Mia and her motives, Elena is determined to uncover the secrets in Mia''s past. But her obsession will come at unexpected and devastating costs. 

Little Fires Everywhere explores the weight of secrets, the nature of art and identity, and the ferocious pull of motherhood – and the danger of believing that following the rules can avert disaster.

“Witnessing these two families as they commingle and clash is an utterly engrossing, often heartbreaking, deeply empathetic experience… It’s this vast and complex network of moral affiliations—and the nuanced omniscient voice that Ng employs to navigate it—that make this novel even more ambitious and accomplished than her debut… The magic of this novel lies in its power to implicate all of its characters—and likely many of its readers—in that innocent delusion [of a post-racial America]. Who set the littles fires everywhere? We keep reading to find out, even as we suspect that it could be us with ash on our hands.”

— NEW YORK TIMES BOOK REVIEW
🔥

“Ng has one-upped herself with her tremendous follow-up novel… a finely wrought meditation on the nature of motherhood, the dangers of privilege and a cautionary tale about how even the tiniest of secrets can rip families apart… Ng is a master at pushing us to look at our personal and societal flaws in the face and see them with new eyes… If Little Fires Everywhere doesn’t give you pause and help you think differently about humanity and this country’s current state of affairs, start over from the beginning and read the book again.”

—SAN FRANCISCO CHRONICLE
🔥

“Stellar… The plot is tightly structured, full of echoes and convergence, the characters bound together by a growing number of thick, overlapping threads… Ng is a confident, talented writer, and it’s a pleasure to inhabit the lives of her characters and experience the rhythms of Shaker Heights through her clean, observant prose… She toggles between multiple points of view, creating a narrative both broad in scope and fine in detail, all while keeping the story moving at a thriller’s pace.”

—LOS ANGELES TIMES
🔥

“Delectable and engrossing… A complex and compulsively readable suburban saga that is deeply invested in mothers and daughters…What Ng has written, in this thoroughly entertaining novel, is a pointed and persuasive social critique, teasing out the myriad forms of privilege and predation that stand between so many people and their achievement of the American dream. But there is a heartening optimism, too. This is a book that believes in the transformative powers of art and genuine kindness — and in the promise of new growth, even after devastation, even after everything has turned to ash.”

—BOSTON GLOBE 
🔥

“[Ng] widens her aperture to include a deeper, more diverse cast of characters. Though the book’s language is clean and straightforward, almost conversational, Ng has an acute sense of how real people (especially teenagers, the slang-slinging kryptonite of many an aspiring novelist) think and feel and communicate. Shaker Heights may be a place where ‘things were peaceful, and riots and bombs and earthquakes were quiet thumps, muffled by distance.’ But the real world is never as far away as it seems, of course. And if the scrim can’t be broken, sometimes you have to burn it down. Grade: A-”

—ENTERTAINMENT WEEKLY', 'https://covers.openlibrary.org/b/id/8111914-L.jpg', 3.4, 55, 'A1-01', 140000, NOW(), NOW()),
(240, 'Beginning programming for dummies', 'Wallace Wang', 'ISBN-240', 'Unknown Publisher', '2023-01-01', 327, 'Discover the latest programming tips and techniquesStart writing programs for Windows, Linux, Macintosh, Palms, and PocketPCsReady to take control of your computer by writing your own programs? Mixing concepts with humor, author Wallace Wang shows you how to begin programming as simply and quickly as possible. In no time, you''ll find out how to create and debug programs in Liberty BASIC, use algorithms, build interactive Web pages, and more!All this on the bonus CD-ROM Liberty BASIC and other compilers All the examples and code from the book IBM Robocode V1.0.6 JBuilder 9 Personal, C# Builder Personal, and Kylix Enterprise TrialSee the "About the CD-ROM" appendix for details and complete system requirements.Discover how to: Choose the best programming language for your project Work with data structures Install and use Liberty BASIC Create interactive Web sites  Program multiple platform devicesNote: CD-ROM/DVD and other supplementary materials are not included.', 'https://covers.openlibrary.org/b/id/520470-L.jpg', 4.7, 482, 'A1-01', 100000, NOW(), NOW()),
(241, 'Born standing up', 'Steve Martin', 'ISBN-241', 'Unknown Publisher', '2023-01-01', 184, 'The author shares the stories of his years in stand-up comedy in a humorous memoir that recalls a first job selling guidebooks at Disneyland, his early magic and comedy act, his years of honing his craft, and the sacrifice, discipline, and originality it took to take him to the top.', 'https://covers.openlibrary.org/b/id/6820382-L.jpg', 4.6, 103, 'A1-01', 140000, NOW(), NOW()),
(242, 'Prodigy', 'Marie Lu', 'ISBN-242', 'Unknown Publisher', '2023-01-01', 137, 'June and Day make their way to Las Vegas where they join the rebel Patriot group and become involved in an assassination plot against the Elector in hopes of saving the Republic.', 'https://covers.openlibrary.org/b/id/9257778-L.jpg', 4.7, 501, 'A1-01', 120000, NOW(), NOW()),
(243, 'Hokusai manga', 'Hokusai Katsushika', 'ISBN-243', 'Unknown Publisher', '2023-01-01', 217, 'Hokusai manga is a fascinating book covering topics in manga.', 'https://covers.openlibrary.org/b/id/11880910-L.jpg', 3.1, 190, 'A1-01', 100000, NOW(), NOW()),
(244, 'The Rape of the Lock', 'Alexander Pope', 'ISBN-244', 'Unknown Publisher', '2023-01-01', 116, 'A satiric poem about Belinda and the evil Baron who wants to steal a lock of her hair, it is a commentary on the battle of the sexes and the contemporary social world of high society.', 'https://covers.openlibrary.org/b/id/8234360-L.jpg', 4.2, 217, 'A1-01', 90000, NOW(), NOW()),
(245, 'Phonics Comics', 'Brent Sudduth', 'ISBN-245', 'Unknown Publisher', '2023-01-01', 172, 'Phonics Comics is a fascinating book covering topics in comic.', 'https://covers.openlibrary.org/b/id/1949417-L.jpg', 4.2, 171, 'A1-01', 80000, NOW(), NOW()),
(246, 'Cat Kid Comic Club', 'Dav Pilkey', 'ISBN-246', 'Unknown Publisher', '2023-01-01', 150, 'A pioneering new graphic novel series by Dav Pilkey, the author and illustrator of the internationally bestselling Dog Man and Captain Underpants series.
Naomi, Melvin, Pedro, and Poppy are just a few of the twenty-one rambunctious, funny, and talented baby frogs who share their stories in the Cat Kid Comic Club. Can Li''l Petey, Molly, and Flippy help the students express themselves through comics? The adventures in class and on paper unwind with mishaps and hilarity as the creative baby frogs experience the mistakes and progress that come with practice and persistence.

"Squid Kid and Katydid," "Baby Frog Squad," "Monster Cheese Sandwich," "Birds Flowers Trees: A Haiku Photo Comic," and other mini-comics are featured as stories-within-the-story, each done in a different style, utilizing humor and drama, prose and poetry, illustrated in different media including acrylics, pastels, colored pencils, felt-tip markers, clay, hand-made cardboard sculptures, photographs, pipe cleaners, construction paper collages, and cookies.

This heartfelt, humorous, and thoughtful graphic novel by award-winning author and artist Dav Pilkey will have readers of all ages laughing and motivated to unleash their own creativity.', 'https://covers.openlibrary.org/b/id/14424590-L.jpg', 5.0, 486, 'A1-01', 80000, NOW(), NOW()),
(247, 'C programming', 'K. N. King', 'ISBN-247', 'Unknown Publisher', '2023-01-01', 488, 'C programming is a fascinating book covering topics in programming.', 'https://covers.openlibrary.org/b/id/252635-L.jpg', 3.4, 324, 'A1-01', 140000, NOW(), NOW()),
(248, 'Maus I', 'Art Spiegelman', 'ISBN-248', 'Unknown Publisher', '2023-01-01', 287, 'A story of a Jewish survivor of Hitler''s Europe and his son, a cartoonist who tries to come to terms with his father''s story and history itself.', 'https://covers.openlibrary.org/b/id/10210168-L.jpg', 4.5, 83, 'A1-01', 70000, NOW(), NOW()),
(249, 'Warrior''s Refuge', 'Erin Hunter', 'ISBN-249', 'Unknown Publisher', '2023-01-01', 413, 'Graystripe and Millie''s journey to find ThunderClan has only just begun when the pair is faced with a series of obstacles that seem insurmountable. Getting out of Twolegplace alive isn''t nearly as simple as expected, and Millie''s unfamiliarity with life in the wild makes it a challenge for Graystripe to keep them both moving forward. But just when a temporary refuge is in sight, conflict with a tribe of barn cats threatens to break the travelers apart for good!


----------
**Books in this series**

 1. [The Lost Warrior][1]
 2. Warrior''s Refuge
 3. [Warrior''s Return][3]

  [1]: https://openlibrary.org/works/OL20642040W
  [3]: https://openlibrary.org/works/OL6043965W', 'https://covers.openlibrary.org/b/id/7026569-L.jpg', 3.4, 301, 'A1-01', 60000, NOW(), NOW());

-- 4. Book Authors
INSERT IGNORE INTO book_authors (book_id, author_id) VALUES
(100, 100),
(101, 101),
(102, 102),
(103, 103),
(104, 104),
(105, 105),
(106, 101),
(107, 102),
(108, 106),
(109, 107),
(110, 108),
(111, 109),
(112, 110),
(113, 111),
(114, 112),
(115, 113),
(116, 114),
(117, 115),
(118, 116),
(119, 117),
(120, 118),
(121, 119),
(122, 120),
(123, 121),
(124, 122),
(125, 123),
(126, 124),
(127, 125),
(128, 126),
(129, 127),
(130, 128),
(131, 129),
(132, 130),
(133, 131),
(134, 132),
(135, 133),
(136, 134),
(137, 135),
(138, 136),
(139, 137),
(140, 138),
(141, 139),
(142, 140),
(143, 141),
(144, 142),
(145, 143),
(146, 144),
(147, 145),
(148, 146),
(149, 147),
(150, 148),
(151, 149),
(152, 150),
(153, 151),
(154, 152),
(155, 153),
(156, 154),
(157, 155),
(158, 156),
(159, 157),
(160, 124),
(161, 158),
(162, 159),
(163, 160),
(164, 161),
(165, 162),
(166, 163),
(167, 142),
(168, 164),
(169, 165),
(170, 166),
(171, 167),
(172, 168),
(173, 119),
(174, 169),
(175, 170),
(176, 171),
(177, 172),
(178, 173),
(179, 174),
(180, 175),
(181, 176),
(182, 177),
(183, 178),
(184, 179),
(185, 180),
(186, 161),
(187, 181),
(188, 182),
(189, 183),
(190, 184),
(191, 185),
(192, 186),
(193, 187),
(194, 153),
(195, 188),
(196, 189),
(197, 190),
(198, 191),
(199, 107),
(200, 192),
(201, 169),
(202, 193),
(203, 194),
(204, 195),
(205, 196),
(206, 197),
(207, 198),
(208, 199),
(209, 102),
(210, 200),
(211, 201),
(212, 119),
(213, 202),
(214, 161),
(215, 203),
(216, 204),
(217, 205),
(218, 102),
(219, 206),
(220, 122),
(221, 207),
(222, 208),
(223, 209),
(224, 102),
(225, 210),
(226, 131),
(227, 211),
(228, 200),
(229, 169),
(230, 212),
(231, 175),
(232, 213),
(233, 214),
(234, 215),
(235, 216),
(236, 101),
(237, 217),
(238, 218),
(239, 219),
(240, 220),
(241, 221),
(242, 222),
(243, 223),
(244, 224),
(245, 225),
(246, 118),
(247, 226),
(248, 227),
(249, 192);

-- 5. Book Categories
INSERT IGNORE INTO book_categories (book_id, category_id) VALUES
(100, 100),
(101, 101),
(102, 101),
(103, 101),
(104, 101),
(105, 101),
(106, 101),
(107, 101),
(108, 101),
(109, 102),
(110, 102),
(111, 101),
(112, 101),
(113, 102),
(114, 102),
(115, 101),
(116, 102),
(117, 102),
(118, 103),
(119, 100),
(120, 102),
(121, 100),
(122, 100),
(123, 103),
(124, 102),
(125, 104),
(126, 103),
(127, 100),
(128, 104),
(129, 102),
(130, 104),
(131, 102),
(132, 104),
(133, 103),
(134, 104),
(135, 100),
(136, 102),
(137, 103),
(138, 100),
(139, 100),
(140, 101),
(141, 101),
(142, 101),
(143, 101),
(144, 103),
(145, 100),
(146, 100),
(147, 100),
(148, 100),
(149, 102),
(150, 104),
(151, 103),
(152, 103),
(153, 100),
(154, 104),
(155, 102),
(156, 104),
(157, 102),
(158, 100),
(159, 101),
(160, 103),
(161, 104),
(162, 101),
(163, 104),
(164, 101),
(165, 102),
(166, 103),
(167, 103),
(168, 104),
(169, 104),
(170, 103),
(171, 104),
(172, 102),
(173, 100),
(174, 103),
(175, 104),
(176, 104),
(177, 102),
(178, 103),
(179, 105),
(180, 104),
(181, 103),
(182, 104),
(183, 100),
(184, 104),
(185, 104),
(186, 101),
(187, 103),
(188, 103),
(189, 104),
(190, 104),
(191, 101),
(192, 101),
(193, 104),
(194, 100),
(195, 104),
(196, 100),
(197, 103),
(198, 104),
(199, 102),
(200, 100),
(201, 103),
(202, 104),
(203, 100),
(204, 100),
(205, 104),
(206, 100),
(207, 103),
(208, 103),
(209, 101),
(210, 102),
(211, 103),
(212, 100),
(213, 100),
(214, 101),
(215, 101),
(216, 102),
(217, 101),
(218, 101),
(219, 100),
(220, 102),
(221, 103),
(222, 102),
(223, 103),
(224, 102),
(225, 100),
(226, 103),
(227, 104),
(228, 102),
(229, 103),
(230, 100),
(231, 104),
(232, 101),
(233, 100),
(234, 102),
(235, 102),
(236, 101),
(237, 103),
(238, 104),
(239, 101),
(240, 103),
(241, 102),
(242, 101),
(243, 100),
(244, 102),
(245, 102),
(246, 102),
(247, 103),
(248, 104),
(249, 100);

-- 6. Copies
INSERT IGNORE INTO book_copies (book_id, barcode, status, condition_note, created_at, updated_at) VALUES
(100, 'BC-1000', 'AVAILABLE', '', NOW(), NOW()),
(101, 'BC-1001', 'AVAILABLE', '', NOW(), NOW()),
(101, 'BC-1002', 'AVAILABLE', '', NOW(), NOW()),
(101, 'BC-1003', 'AVAILABLE', '', NOW(), NOW()),
(101, 'BC-1004', 'AVAILABLE', '', NOW(), NOW()),
(102, 'BC-1005', 'AVAILABLE', '', NOW(), NOW()),
(102, 'BC-1006', 'AVAILABLE', '', NOW(), NOW()),
(102, 'BC-1007', 'AVAILABLE', '', NOW(), NOW()),
(103, 'BC-1008', 'AVAILABLE', '', NOW(), NOW()),
(104, 'BC-1009', 'AVAILABLE', '', NOW(), NOW()),
(104, 'BC-1010', 'AVAILABLE', '', NOW(), NOW()),
(104, 'BC-1011', 'AVAILABLE', '', NOW(), NOW()),
(105, 'BC-1012', 'AVAILABLE', '', NOW(), NOW()),
(105, 'BC-1013', 'AVAILABLE', '', NOW(), NOW()),
(105, 'BC-1014', 'AVAILABLE', '', NOW(), NOW()),
(105, 'BC-1015', 'AVAILABLE', '', NOW(), NOW()),
(106, 'BC-1016', 'AVAILABLE', '', NOW(), NOW()),
(107, 'BC-1017', 'AVAILABLE', '', NOW(), NOW()),
(108, 'BC-1018', 'AVAILABLE', '', NOW(), NOW()),
(108, 'BC-1019', 'AVAILABLE', '', NOW(), NOW()),
(108, 'BC-1020', 'AVAILABLE', '', NOW(), NOW()),
(109, 'BC-1021', 'AVAILABLE', '', NOW(), NOW()),
(109, 'BC-1022', 'AVAILABLE', '', NOW(), NOW()),
(109, 'BC-1023', 'AVAILABLE', '', NOW(), NOW()),
(109, 'BC-1024', 'AVAILABLE', '', NOW(), NOW()),
(110, 'BC-1025', 'AVAILABLE', '', NOW(), NOW()),
(110, 'BC-1026', 'AVAILABLE', '', NOW(), NOW()),
(111, 'BC-1027', 'AVAILABLE', '', NOW(), NOW()),
(111, 'BC-1028', 'AVAILABLE', '', NOW(), NOW()),
(111, 'BC-1029', 'AVAILABLE', '', NOW(), NOW()),
(111, 'BC-1030', 'AVAILABLE', '', NOW(), NOW()),
(112, 'BC-1031', 'AVAILABLE', '', NOW(), NOW()),
(112, 'BC-1032', 'AVAILABLE', '', NOW(), NOW()),
(112, 'BC-1033', 'AVAILABLE', '', NOW(), NOW()),
(113, 'BC-1034', 'AVAILABLE', '', NOW(), NOW()),
(113, 'BC-1035', 'AVAILABLE', '', NOW(), NOW()),
(114, 'BC-1036', 'AVAILABLE', '', NOW(), NOW()),
(115, 'BC-1037', 'AVAILABLE', '', NOW(), NOW()),
(115, 'BC-1038', 'AVAILABLE', '', NOW(), NOW()),
(115, 'BC-1039', 'AVAILABLE', '', NOW(), NOW()),
(116, 'BC-1040', 'AVAILABLE', '', NOW(), NOW()),
(117, 'BC-1041', 'AVAILABLE', '', NOW(), NOW()),
(117, 'BC-1042', 'AVAILABLE', '', NOW(), NOW()),
(118, 'BC-1043', 'AVAILABLE', '', NOW(), NOW()),
(118, 'BC-1044', 'AVAILABLE', '', NOW(), NOW()),
(118, 'BC-1045', 'AVAILABLE', '', NOW(), NOW()),
(119, 'BC-1046', 'AVAILABLE', '', NOW(), NOW()),
(119, 'BC-1047', 'AVAILABLE', '', NOW(), NOW()),
(119, 'BC-1048', 'AVAILABLE', '', NOW(), NOW()),
(120, 'BC-1049', 'AVAILABLE', '', NOW(), NOW()),
(120, 'BC-1050', 'AVAILABLE', '', NOW(), NOW()),
(120, 'BC-1051', 'AVAILABLE', '', NOW(), NOW()),
(121, 'BC-1052', 'AVAILABLE', '', NOW(), NOW()),
(122, 'BC-1053', 'AVAILABLE', '', NOW(), NOW()),
(123, 'BC-1054', 'AVAILABLE', '', NOW(), NOW()),
(123, 'BC-1055', 'AVAILABLE', '', NOW(), NOW()),
(123, 'BC-1056', 'AVAILABLE', '', NOW(), NOW()),
(123, 'BC-1057', 'AVAILABLE', '', NOW(), NOW()),
(124, 'BC-1058', 'AVAILABLE', '', NOW(), NOW()),
(124, 'BC-1059', 'AVAILABLE', '', NOW(), NOW()),
(124, 'BC-1060', 'AVAILABLE', '', NOW(), NOW()),
(125, 'BC-1061', 'AVAILABLE', '', NOW(), NOW()),
(125, 'BC-1062', 'AVAILABLE', '', NOW(), NOW()),
(125, 'BC-1063', 'AVAILABLE', '', NOW(), NOW()),
(125, 'BC-1064', 'AVAILABLE', '', NOW(), NOW()),
(126, 'BC-1065', 'AVAILABLE', '', NOW(), NOW()),
(126, 'BC-1066', 'AVAILABLE', '', NOW(), NOW()),
(127, 'BC-1067', 'AVAILABLE', '', NOW(), NOW()),
(127, 'BC-1068', 'AVAILABLE', '', NOW(), NOW()),
(127, 'BC-1069', 'AVAILABLE', '', NOW(), NOW()),
(128, 'BC-1070', 'AVAILABLE', '', NOW(), NOW()),
(129, 'BC-1071', 'AVAILABLE', '', NOW(), NOW()),
(130, 'BC-1072', 'AVAILABLE', '', NOW(), NOW()),
(130, 'BC-1073', 'AVAILABLE', '', NOW(), NOW()),
(130, 'BC-1074', 'AVAILABLE', '', NOW(), NOW()),
(131, 'BC-1075', 'AVAILABLE', '', NOW(), NOW()),
(131, 'BC-1076', 'AVAILABLE', '', NOW(), NOW()),
(131, 'BC-1077', 'AVAILABLE', '', NOW(), NOW()),
(131, 'BC-1078', 'AVAILABLE', '', NOW(), NOW()),
(132, 'BC-1079', 'AVAILABLE', '', NOW(), NOW()),
(133, 'BC-1080', 'AVAILABLE', '', NOW(), NOW()),
(133, 'BC-1081', 'AVAILABLE', '', NOW(), NOW()),
(134, 'BC-1082', 'AVAILABLE', '', NOW(), NOW()),
(134, 'BC-1083', 'AVAILABLE', '', NOW(), NOW()),
(134, 'BC-1084', 'AVAILABLE', '', NOW(), NOW()),
(134, 'BC-1085', 'AVAILABLE', '', NOW(), NOW()),
(135, 'BC-1086', 'AVAILABLE', '', NOW(), NOW()),
(136, 'BC-1087', 'AVAILABLE', '', NOW(), NOW()),
(136, 'BC-1088', 'AVAILABLE', '', NOW(), NOW()),
(137, 'BC-1089', 'AVAILABLE', '', NOW(), NOW()),
(137, 'BC-1090', 'AVAILABLE', '', NOW(), NOW()),
(138, 'BC-1091', 'AVAILABLE', '', NOW(), NOW()),
(139, 'BC-1092', 'AVAILABLE', '', NOW(), NOW()),
(139, 'BC-1093', 'AVAILABLE', '', NOW(), NOW()),
(140, 'BC-1094', 'AVAILABLE', '', NOW(), NOW()),
(140, 'BC-1095', 'AVAILABLE', '', NOW(), NOW()),
(140, 'BC-1096', 'AVAILABLE', '', NOW(), NOW()),
(141, 'BC-1097', 'AVAILABLE', '', NOW(), NOW()),
(142, 'BC-1098', 'AVAILABLE', '', NOW(), NOW()),
(142, 'BC-1099', 'AVAILABLE', '', NOW(), NOW()),
(143, 'BC-1100', 'AVAILABLE', '', NOW(), NOW()),
(143, 'BC-1101', 'AVAILABLE', '', NOW(), NOW()),
(143, 'BC-1102', 'AVAILABLE', '', NOW(), NOW()),
(144, 'BC-1103', 'AVAILABLE', '', NOW(), NOW()),
(144, 'BC-1104', 'AVAILABLE', '', NOW(), NOW()),
(145, 'BC-1105', 'AVAILABLE', '', NOW(), NOW()),
(145, 'BC-1106', 'AVAILABLE', '', NOW(), NOW()),
(146, 'BC-1107', 'AVAILABLE', '', NOW(), NOW()),
(146, 'BC-1108', 'AVAILABLE', '', NOW(), NOW()),
(147, 'BC-1109', 'AVAILABLE', '', NOW(), NOW()),
(147, 'BC-1110', 'AVAILABLE', '', NOW(), NOW()),
(147, 'BC-1111', 'AVAILABLE', '', NOW(), NOW()),
(148, 'BC-1112', 'AVAILABLE', '', NOW(), NOW()),
(148, 'BC-1113', 'AVAILABLE', '', NOW(), NOW()),
(149, 'BC-1114', 'AVAILABLE', '', NOW(), NOW()),
(149, 'BC-1115', 'AVAILABLE', '', NOW(), NOW()),
(150, 'BC-1116', 'AVAILABLE', '', NOW(), NOW()),
(150, 'BC-1117', 'AVAILABLE', '', NOW(), NOW()),
(151, 'BC-1118', 'AVAILABLE', '', NOW(), NOW()),
(151, 'BC-1119', 'AVAILABLE', '', NOW(), NOW()),
(152, 'BC-1120', 'AVAILABLE', '', NOW(), NOW()),
(153, 'BC-1121', 'AVAILABLE', '', NOW(), NOW()),
(154, 'BC-1122', 'AVAILABLE', '', NOW(), NOW()),
(154, 'BC-1123', 'AVAILABLE', '', NOW(), NOW()),
(154, 'BC-1124', 'AVAILABLE', '', NOW(), NOW()),
(154, 'BC-1125', 'AVAILABLE', '', NOW(), NOW()),
(155, 'BC-1126', 'AVAILABLE', '', NOW(), NOW()),
(155, 'BC-1127', 'AVAILABLE', '', NOW(), NOW()),
(155, 'BC-1128', 'AVAILABLE', '', NOW(), NOW()),
(155, 'BC-1129', 'AVAILABLE', '', NOW(), NOW()),
(156, 'BC-1130', 'AVAILABLE', '', NOW(), NOW()),
(156, 'BC-1131', 'AVAILABLE', '', NOW(), NOW()),
(156, 'BC-1132', 'AVAILABLE', '', NOW(), NOW()),
(156, 'BC-1133', 'AVAILABLE', '', NOW(), NOW()),
(157, 'BC-1134', 'AVAILABLE', '', NOW(), NOW()),
(157, 'BC-1135', 'AVAILABLE', '', NOW(), NOW()),
(157, 'BC-1136', 'AVAILABLE', '', NOW(), NOW()),
(158, 'BC-1137', 'AVAILABLE', '', NOW(), NOW()),
(158, 'BC-1138', 'AVAILABLE', '', NOW(), NOW()),
(158, 'BC-1139', 'AVAILABLE', '', NOW(), NOW()),
(158, 'BC-1140', 'AVAILABLE', '', NOW(), NOW()),
(159, 'BC-1141', 'AVAILABLE', '', NOW(), NOW()),
(159, 'BC-1142', 'AVAILABLE', '', NOW(), NOW()),
(159, 'BC-1143', 'AVAILABLE', '', NOW(), NOW()),
(160, 'BC-1144', 'AVAILABLE', '', NOW(), NOW()),
(161, 'BC-1145', 'AVAILABLE', '', NOW(), NOW()),
(162, 'BC-1146', 'AVAILABLE', '', NOW(), NOW()),
(162, 'BC-1147', 'AVAILABLE', '', NOW(), NOW()),
(162, 'BC-1148', 'AVAILABLE', '', NOW(), NOW()),
(162, 'BC-1149', 'AVAILABLE', '', NOW(), NOW()),
(163, 'BC-1150', 'AVAILABLE', '', NOW(), NOW()),
(163, 'BC-1151', 'AVAILABLE', '', NOW(), NOW()),
(163, 'BC-1152', 'AVAILABLE', '', NOW(), NOW()),
(164, 'BC-1153', 'AVAILABLE', '', NOW(), NOW()),
(164, 'BC-1154', 'AVAILABLE', '', NOW(), NOW()),
(165, 'BC-1155', 'AVAILABLE', '', NOW(), NOW()),
(165, 'BC-1156', 'AVAILABLE', '', NOW(), NOW()),
(165, 'BC-1157', 'AVAILABLE', '', NOW(), NOW()),
(165, 'BC-1158', 'AVAILABLE', '', NOW(), NOW()),
(166, 'BC-1159', 'AVAILABLE', '', NOW(), NOW()),
(166, 'BC-1160', 'AVAILABLE', '', NOW(), NOW()),
(167, 'BC-1161', 'AVAILABLE', '', NOW(), NOW()),
(167, 'BC-1162', 'AVAILABLE', '', NOW(), NOW()),
(168, 'BC-1163', 'AVAILABLE', '', NOW(), NOW()),
(168, 'BC-1164', 'AVAILABLE', '', NOW(), NOW()),
(168, 'BC-1165', 'AVAILABLE', '', NOW(), NOW()),
(169, 'BC-1166', 'AVAILABLE', '', NOW(), NOW()),
(169, 'BC-1167', 'AVAILABLE', '', NOW(), NOW()),
(170, 'BC-1168', 'AVAILABLE', '', NOW(), NOW()),
(170, 'BC-1169', 'AVAILABLE', '', NOW(), NOW()),
(170, 'BC-1170', 'AVAILABLE', '', NOW(), NOW()),
(170, 'BC-1171', 'AVAILABLE', '', NOW(), NOW()),
(171, 'BC-1172', 'AVAILABLE', '', NOW(), NOW()),
(171, 'BC-1173', 'AVAILABLE', '', NOW(), NOW()),
(172, 'BC-1174', 'AVAILABLE', '', NOW(), NOW()),
(172, 'BC-1175', 'AVAILABLE', '', NOW(), NOW()),
(173, 'BC-1176', 'AVAILABLE', '', NOW(), NOW()),
(173, 'BC-1177', 'AVAILABLE', '', NOW(), NOW()),
(174, 'BC-1178', 'AVAILABLE', '', NOW(), NOW()),
(174, 'BC-1179', 'AVAILABLE', '', NOW(), NOW()),
(174, 'BC-1180', 'AVAILABLE', '', NOW(), NOW()),
(175, 'BC-1181', 'AVAILABLE', '', NOW(), NOW()),
(176, 'BC-1182', 'AVAILABLE', '', NOW(), NOW()),
(176, 'BC-1183', 'AVAILABLE', '', NOW(), NOW()),
(176, 'BC-1184', 'AVAILABLE', '', NOW(), NOW()),
(176, 'BC-1185', 'AVAILABLE', '', NOW(), NOW()),
(177, 'BC-1186', 'AVAILABLE', '', NOW(), NOW()),
(178, 'BC-1187', 'AVAILABLE', '', NOW(), NOW()),
(178, 'BC-1188', 'AVAILABLE', '', NOW(), NOW()),
(179, 'BC-1189', 'AVAILABLE', '', NOW(), NOW()),
(179, 'BC-1190', 'AVAILABLE', '', NOW(), NOW()),
(179, 'BC-1191', 'AVAILABLE', '', NOW(), NOW()),
(180, 'BC-1192', 'AVAILABLE', '', NOW(), NOW()),
(180, 'BC-1193', 'AVAILABLE', '', NOW(), NOW()),
(180, 'BC-1194', 'AVAILABLE', '', NOW(), NOW()),
(180, 'BC-1195', 'AVAILABLE', '', NOW(), NOW()),
(181, 'BC-1196', 'AVAILABLE', '', NOW(), NOW()),
(181, 'BC-1197', 'AVAILABLE', '', NOW(), NOW()),
(181, 'BC-1198', 'AVAILABLE', '', NOW(), NOW()),
(181, 'BC-1199', 'AVAILABLE', '', NOW(), NOW()),
(182, 'BC-1200', 'AVAILABLE', '', NOW(), NOW()),
(182, 'BC-1201', 'AVAILABLE', '', NOW(), NOW()),
(183, 'BC-1202', 'AVAILABLE', '', NOW(), NOW()),
(183, 'BC-1203', 'AVAILABLE', '', NOW(), NOW()),
(183, 'BC-1204', 'AVAILABLE', '', NOW(), NOW()),
(184, 'BC-1205', 'AVAILABLE', '', NOW(), NOW()),
(184, 'BC-1206', 'AVAILABLE', '', NOW(), NOW()),
(184, 'BC-1207', 'AVAILABLE', '', NOW(), NOW()),
(185, 'BC-1208', 'AVAILABLE', '', NOW(), NOW()),
(186, 'BC-1209', 'AVAILABLE', '', NOW(), NOW()),
(186, 'BC-1210', 'AVAILABLE', '', NOW(), NOW()),
(186, 'BC-1211', 'AVAILABLE', '', NOW(), NOW()),
(187, 'BC-1212', 'AVAILABLE', '', NOW(), NOW()),
(187, 'BC-1213', 'AVAILABLE', '', NOW(), NOW()),
(187, 'BC-1214', 'AVAILABLE', '', NOW(), NOW()),
(187, 'BC-1215', 'AVAILABLE', '', NOW(), NOW()),
(188, 'BC-1216', 'AVAILABLE', '', NOW(), NOW()),
(188, 'BC-1217', 'AVAILABLE', '', NOW(), NOW()),
(188, 'BC-1218', 'AVAILABLE', '', NOW(), NOW()),
(189, 'BC-1219', 'AVAILABLE', '', NOW(), NOW()),
(189, 'BC-1220', 'AVAILABLE', '', NOW(), NOW()),
(189, 'BC-1221', 'AVAILABLE', '', NOW(), NOW()),
(189, 'BC-1222', 'AVAILABLE', '', NOW(), NOW()),
(190, 'BC-1223', 'AVAILABLE', '', NOW(), NOW()),
(190, 'BC-1224', 'AVAILABLE', '', NOW(), NOW()),
(191, 'BC-1225', 'AVAILABLE', '', NOW(), NOW()),
(191, 'BC-1226', 'AVAILABLE', '', NOW(), NOW()),
(191, 'BC-1227', 'AVAILABLE', '', NOW(), NOW()),
(191, 'BC-1228', 'AVAILABLE', '', NOW(), NOW()),
(192, 'BC-1229', 'AVAILABLE', '', NOW(), NOW()),
(193, 'BC-1230', 'AVAILABLE', '', NOW(), NOW()),
(193, 'BC-1231', 'AVAILABLE', '', NOW(), NOW()),
(193, 'BC-1232', 'AVAILABLE', '', NOW(), NOW()),
(194, 'BC-1233', 'AVAILABLE', '', NOW(), NOW()),
(194, 'BC-1234', 'AVAILABLE', '', NOW(), NOW()),
(194, 'BC-1235', 'AVAILABLE', '', NOW(), NOW()),
(195, 'BC-1236', 'AVAILABLE', '', NOW(), NOW()),
(196, 'BC-1237', 'AVAILABLE', '', NOW(), NOW()),
(196, 'BC-1238', 'AVAILABLE', '', NOW(), NOW()),
(196, 'BC-1239', 'AVAILABLE', '', NOW(), NOW()),
(197, 'BC-1240', 'AVAILABLE', '', NOW(), NOW()),
(197, 'BC-1241', 'AVAILABLE', '', NOW(), NOW()),
(197, 'BC-1242', 'AVAILABLE', '', NOW(), NOW()),
(198, 'BC-1243', 'AVAILABLE', '', NOW(), NOW()),
(198, 'BC-1244', 'AVAILABLE', '', NOW(), NOW()),
(198, 'BC-1245', 'AVAILABLE', '', NOW(), NOW()),
(199, 'BC-1246', 'AVAILABLE', '', NOW(), NOW()),
(199, 'BC-1247', 'AVAILABLE', '', NOW(), NOW()),
(200, 'BC-1248', 'AVAILABLE', '', NOW(), NOW()),
(201, 'BC-1249', 'AVAILABLE', '', NOW(), NOW()),
(201, 'BC-1250', 'AVAILABLE', '', NOW(), NOW()),
(202, 'BC-1251', 'AVAILABLE', '', NOW(), NOW()),
(203, 'BC-1252', 'AVAILABLE', '', NOW(), NOW()),
(204, 'BC-1253', 'AVAILABLE', '', NOW(), NOW()),
(204, 'BC-1254', 'AVAILABLE', '', NOW(), NOW()),
(205, 'BC-1255', 'AVAILABLE', '', NOW(), NOW()),
(205, 'BC-1256', 'AVAILABLE', '', NOW(), NOW()),
(205, 'BC-1257', 'AVAILABLE', '', NOW(), NOW()),
(205, 'BC-1258', 'AVAILABLE', '', NOW(), NOW()),
(206, 'BC-1259', 'AVAILABLE', '', NOW(), NOW()),
(207, 'BC-1260', 'AVAILABLE', '', NOW(), NOW()),
(207, 'BC-1261', 'AVAILABLE', '', NOW(), NOW()),
(207, 'BC-1262', 'AVAILABLE', '', NOW(), NOW()),
(207, 'BC-1263', 'AVAILABLE', '', NOW(), NOW()),
(208, 'BC-1264', 'AVAILABLE', '', NOW(), NOW()),
(208, 'BC-1265', 'AVAILABLE', '', NOW(), NOW()),
(209, 'BC-1266', 'AVAILABLE', '', NOW(), NOW()),
(210, 'BC-1267', 'AVAILABLE', '', NOW(), NOW()),
(210, 'BC-1268', 'AVAILABLE', '', NOW(), NOW()),
(210, 'BC-1269', 'AVAILABLE', '', NOW(), NOW()),
(210, 'BC-1270', 'AVAILABLE', '', NOW(), NOW()),
(211, 'BC-1271', 'AVAILABLE', '', NOW(), NOW()),
(211, 'BC-1272', 'AVAILABLE', '', NOW(), NOW()),
(211, 'BC-1273', 'AVAILABLE', '', NOW(), NOW()),
(212, 'BC-1274', 'AVAILABLE', '', NOW(), NOW()),
(212, 'BC-1275', 'AVAILABLE', '', NOW(), NOW()),
(212, 'BC-1276', 'AVAILABLE', '', NOW(), NOW()),
(212, 'BC-1277', 'AVAILABLE', '', NOW(), NOW()),
(213, 'BC-1278', 'AVAILABLE', '', NOW(), NOW()),
(214, 'BC-1279', 'AVAILABLE', '', NOW(), NOW()),
(214, 'BC-1280', 'AVAILABLE', '', NOW(), NOW()),
(214, 'BC-1281', 'AVAILABLE', '', NOW(), NOW()),
(214, 'BC-1282', 'AVAILABLE', '', NOW(), NOW()),
(215, 'BC-1283', 'AVAILABLE', '', NOW(), NOW()),
(215, 'BC-1284', 'AVAILABLE', '', NOW(), NOW()),
(215, 'BC-1285', 'AVAILABLE', '', NOW(), NOW()),
(215, 'BC-1286', 'AVAILABLE', '', NOW(), NOW()),
(216, 'BC-1287', 'AVAILABLE', '', NOW(), NOW()),
(216, 'BC-1288', 'AVAILABLE', '', NOW(), NOW()),
(216, 'BC-1289', 'AVAILABLE', '', NOW(), NOW()),
(217, 'BC-1290', 'AVAILABLE', '', NOW(), NOW()),
(217, 'BC-1291', 'AVAILABLE', '', NOW(), NOW()),
(217, 'BC-1292', 'AVAILABLE', '', NOW(), NOW()),
(217, 'BC-1293', 'AVAILABLE', '', NOW(), NOW()),
(218, 'BC-1294', 'AVAILABLE', '', NOW(), NOW()),
(218, 'BC-1295', 'AVAILABLE', '', NOW(), NOW()),
(219, 'BC-1296', 'AVAILABLE', '', NOW(), NOW()),
(219, 'BC-1297', 'AVAILABLE', '', NOW(), NOW()),
(219, 'BC-1298', 'AVAILABLE', '', NOW(), NOW()),
(219, 'BC-1299', 'AVAILABLE', '', NOW(), NOW()),
(220, 'BC-1300', 'AVAILABLE', '', NOW(), NOW()),
(221, 'BC-1301', 'AVAILABLE', '', NOW(), NOW()),
(221, 'BC-1302', 'AVAILABLE', '', NOW(), NOW()),
(221, 'BC-1303', 'AVAILABLE', '', NOW(), NOW()),
(222, 'BC-1304', 'AVAILABLE', '', NOW(), NOW()),
(222, 'BC-1305', 'AVAILABLE', '', NOW(), NOW()),
(222, 'BC-1306', 'AVAILABLE', '', NOW(), NOW()),
(222, 'BC-1307', 'AVAILABLE', '', NOW(), NOW()),
(223, 'BC-1308', 'AVAILABLE', '', NOW(), NOW()),
(223, 'BC-1309', 'AVAILABLE', '', NOW(), NOW()),
(223, 'BC-1310', 'AVAILABLE', '', NOW(), NOW()),
(223, 'BC-1311', 'AVAILABLE', '', NOW(), NOW()),
(224, 'BC-1312', 'AVAILABLE', '', NOW(), NOW()),
(225, 'BC-1313', 'AVAILABLE', '', NOW(), NOW()),
(225, 'BC-1314', 'AVAILABLE', '', NOW(), NOW()),
(225, 'BC-1315', 'AVAILABLE', '', NOW(), NOW()),
(225, 'BC-1316', 'AVAILABLE', '', NOW(), NOW()),
(226, 'BC-1317', 'AVAILABLE', '', NOW(), NOW()),
(227, 'BC-1318', 'AVAILABLE', '', NOW(), NOW()),
(227, 'BC-1319', 'AVAILABLE', '', NOW(), NOW()),
(227, 'BC-1320', 'AVAILABLE', '', NOW(), NOW()),
(227, 'BC-1321', 'AVAILABLE', '', NOW(), NOW()),
(228, 'BC-1322', 'AVAILABLE', '', NOW(), NOW()),
(229, 'BC-1323', 'AVAILABLE', '', NOW(), NOW()),
(230, 'BC-1324', 'AVAILABLE', '', NOW(), NOW()),
(230, 'BC-1325', 'AVAILABLE', '', NOW(), NOW()),
(231, 'BC-1326', 'AVAILABLE', '', NOW(), NOW()),
(231, 'BC-1327', 'AVAILABLE', '', NOW(), NOW()),
(231, 'BC-1328', 'AVAILABLE', '', NOW(), NOW()),
(231, 'BC-1329', 'AVAILABLE', '', NOW(), NOW()),
(232, 'BC-1330', 'AVAILABLE', '', NOW(), NOW()),
(232, 'BC-1331', 'AVAILABLE', '', NOW(), NOW()),
(232, 'BC-1332', 'AVAILABLE', '', NOW(), NOW()),
(233, 'BC-1333', 'AVAILABLE', '', NOW(), NOW()),
(233, 'BC-1334', 'AVAILABLE', '', NOW(), NOW()),
(233, 'BC-1335', 'AVAILABLE', '', NOW(), NOW()),
(233, 'BC-1336', 'AVAILABLE', '', NOW(), NOW()),
(234, 'BC-1337', 'AVAILABLE', '', NOW(), NOW()),
(235, 'BC-1338', 'AVAILABLE', '', NOW(), NOW()),
(236, 'BC-1339', 'AVAILABLE', '', NOW(), NOW()),
(236, 'BC-1340', 'AVAILABLE', '', NOW(), NOW()),
(237, 'BC-1341', 'AVAILABLE', '', NOW(), NOW()),
(237, 'BC-1342', 'AVAILABLE', '', NOW(), NOW()),
(238, 'BC-1343', 'AVAILABLE', '', NOW(), NOW()),
(238, 'BC-1344', 'AVAILABLE', '', NOW(), NOW()),
(239, 'BC-1345', 'AVAILABLE', '', NOW(), NOW()),
(240, 'BC-1346', 'AVAILABLE', '', NOW(), NOW()),
(240, 'BC-1347', 'AVAILABLE', '', NOW(), NOW()),
(241, 'BC-1348', 'AVAILABLE', '', NOW(), NOW()),
(242, 'BC-1349', 'AVAILABLE', '', NOW(), NOW()),
(243, 'BC-1350', 'AVAILABLE', '', NOW(), NOW()),
(243, 'BC-1351', 'AVAILABLE', '', NOW(), NOW()),
(243, 'BC-1352', 'AVAILABLE', '', NOW(), NOW()),
(244, 'BC-1353', 'AVAILABLE', '', NOW(), NOW()),
(245, 'BC-1354', 'AVAILABLE', '', NOW(), NOW()),
(245, 'BC-1355', 'AVAILABLE', '', NOW(), NOW()),
(245, 'BC-1356', 'AVAILABLE', '', NOW(), NOW()),
(245, 'BC-1357', 'AVAILABLE', '', NOW(), NOW()),
(246, 'BC-1358', 'AVAILABLE', '', NOW(), NOW()),
(246, 'BC-1359', 'AVAILABLE', '', NOW(), NOW()),
(247, 'BC-1360', 'AVAILABLE', '', NOW(), NOW()),
(248, 'BC-1361', 'AVAILABLE', '', NOW(), NOW()),
(248, 'BC-1362', 'AVAILABLE', '', NOW(), NOW()),
(248, 'BC-1363', 'AVAILABLE', '', NOW(), NOW()),
(249, 'BC-1364', 'AVAILABLE', '', NOW(), NOW()),
(249, 'BC-1365', 'AVAILABLE', '', NOW(), NOW()),
(249, 'BC-1366', 'AVAILABLE', '', NOW(), NOW()),
(249, 'BC-1367', 'AVAILABLE', '', NOW(), NOW());

