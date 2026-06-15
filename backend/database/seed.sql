INSERT INTO users(username,full_name,email,password_hash,roles)
VALUES
('drsarah','Dr Sarah Kato','sarah@example.com','hashed_password_1',ARRAY['creator','professional']),
('winnie_ai','Winnie Aryemo','winnie@example.com','hashed_password_2',ARRAY['creator','consultant']);

INSERT INTO posts(user_id,topic,content,call_to_action,platforms)
VALUES
(1,'5 Tips For Preventing Hypertension','Generated content for doctors','Book a consultation',ARRAY['linkedin','facebook']),
(2,'How To Start Content Creation','Generated creator content','Follow for more tips',ARRAY['linkedin','instagram','x']);


INSERT INTO promotion_links(post_id,slug,destination_url)
VALUES
(1,'hypertension-tips','https://linkedin.com/post/123'),
(2,'content-creation-guide','https://youtube.com/watch?v=456');

INSERT INTO analytics_events(user_id,post_id,promotion_link_id,event_type,platform,country,device_type)
VALUES
(1,1,1,'click','linkedin','Uganda','mobile'),
(2,2,2,'view','youtube','Kenya','desktop');


INSERT INTO subscriptions(user_id,plan_name,status)
VALUES
(1,'free','active'),
(2,'free','active');