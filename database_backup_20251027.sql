-- ============================================
-- Supabase Database Backup
-- Project: admin-web-dashboard (esnmmlqzmlnygtmdxdvq)
-- Date: 2025-10-27
-- Database Version: supabase-postgres-17.4.1.054
-- ============================================

-- IMPORTANT: Before restoring this backup, ensure all migrations have been applied.
-- Migration history is stored at the end of this file.

-- ============================================
-- DISABLE TRIGGERS DURING RESTORE
-- ============================================
SET session_replication_role = replica;

-- ============================================
-- TABLE: commerce_user (2 rows)
-- ============================================
INSERT INTO public.commerce_user (id, user_id, password, name, email, phone, address, marketing_agreed, benefits_agreed, created_at, updated_at) VALUES
('343b5b7c-51b7-4b39-ac55-e458ad52de40', 'test', '$2b$10$10kfgP6BIcW7C4876T5QauccCED5q/WSlVYGlE7Git/EgqVNJrUcm', '이광수', 'lisasu94@gmail.com', '01097046951', '서울특별시 강남구 테헤란로 123', true, true, '2025-10-22 08:32:05.204787+00', '2025-10-22 13:45:17.381705+00'),
('c58ac03f-f384-453a-8c12-3d964b975f91', 'testuser', '$2b$10$Uz3kPuuEfzimyt0VYP9lXOCEPPv1WR.IL5ViuUMy5dtdfOc4v1WqW', '테스터', 'testuser@test.com', '01012345678', '서울특별시 강남구 테헤란로 123', true, true, '2025-10-23 08:32:47.177315+00', '2025-10-23 08:32:47.177315+00');

-- ============================================
-- TABLE: products (48 rows)
-- ============================================
INSERT INTO public.products (id, name, category, price, created_at, updated_at, stock, description, sale_price, images, review_count, sales_count) VALUES
('239d84dc-2b0a-438e-870a-166b34d4bf9c', 'LG UltraWide 모니터 34인치', 'ELECTRONIC', 650000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 35, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'], 0, 24),
('0126d084-5997-4aa0-805c-f45f59c450a0', 'Nintendo Switch OLED', 'ELECTRONIC', 420000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 60, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500','https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500'], 0, 67),
('2c87c363-420f-4192-934c-11216eeabb0a', 'Samsung OLED TV 55인치', 'ELECTRONIC', 2200000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 10, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1585282263861-f55e341878f8?w=500'], 0, 46),
('0d46c6ef-561a-4c41-ad4f-3ee05be4a056', 'MacBook Pro 14인치 M3', 'ELECTRONIC', 2800000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 15, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500'], 0, 42),
('e7a4cfee-06fe-4396-bb81-e42ce1ab45ca', 'iPhone 15 Pro Max', 'ELECTRONIC', 1650000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 20, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500','https://images.unsplash.com/photo-1611472173362-3f53dbd65d80?w=500'], 0, 29),
('c4180954-b601-4dc1-b44b-7b5eb9fe6bc3', 'Sony WH-1000XM5', 'ELECTRONIC', 450000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 40, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500','https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'], 0, 24),
('9b51bde9-dbe6-4614-a25c-03af7b763174', 'iPad Pro 12.9인치', 'ELECTRONIC', 1200000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 30, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500','https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=500'], 0, 55),
('ab525b0a-0d6b-40c0-b909-58a7b04c5fcd', 'Apple Magic Keyboard', 'ELECTRONIC', 180000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 80, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'], 0, 0),
('dc3b7167-bbed-4ed6-828f-cb5b2a598ff9', 'Dell XPS 13 Plus', 'ELECTRONIC', 1850000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 18, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500','https://images.unsplash.com/photo-1616763355603-9755a640a287?w=500'], 0, 39),
('29b82be0-36a2-45c8-aada-6ac348a226fe', '로지텍 MX Master 3S', 'ELECTRONIC', 120000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 45, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500'], 0, 37),
('60135487-242e-4923-a17c-b11a99d579e4', '삼성 갤럭시 S24 Ultra', 'ELECTRONIC', 1450000.00, '2025-07-17 17:04:47.087203+00', '2025-10-25 05:52:31.698037+00', 25, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500','https://images.unsplash.com/photo-1678685888221-cda269d593c5?w=500'], 0, 65),
('c2c5e663-985c-401e-8579-ee4f07715154', '골프채 세트', 'SPORT', 850000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 12, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=500','https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=500'], 0, 15),
('13249d41-0c0b-4fc2-af68-6eb322747df4', '펩시콜라 500ml', 'FOOD', 1800.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 160, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1629203849820-c8fe551c87ea?w=500','https://images.unsplash.com/photo-1624517452488-04869289c4ca?w=500'], 0, 69),
('193c9fd7-1d7e-48af-93cf-5f738094ebb2', '프링글스 오리지널', 'FOOD', 2800.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 150, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500','https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500'], 0, 97),
('700d85db-c161-4f62-896e-56e19d63a7f1', '농심 신라면 5개입', 'FOOD', 4200.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 100, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500','https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=500'], 0, 52),
('23e67c14-9fea-4e95-bf12-c7f6d681581d', '오리온 초코파이', 'FOOD', 3500.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 120, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500','https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'], 0, 15),
('68225f94-5dd1-48cc-81ae-8793dd8051ec', '칸쵸 초코비스킷', 'FOOD', 1800.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 180, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500','https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500'], 0, 4),
('bc28fbdf-8880-4c76-84d5-8446cff25916', '스타벅스 프라푸치노 281ml', 'FOOD', 3200.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 80, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1578922746714-f58731c2b01a?w=500','https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500'], 0, 30),
('57d507ee-6741-46f8-a8e0-acdeb0839517', '새우깡', 'FOOD', 1600.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 200, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=500','https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=500'], 0, 3),
('91d0d838-4cad-46a2-82a3-3c8cea5a2da5', '허쉬 키세스 초콜릿', 'FOOD', 4800.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 90, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1511381939415-e44015466834?w=500','https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500'], 0, 74),
('b92599b7-4b8a-4a35-b948-e4e02016d1bf', '나이키 에어포스1', 'SPORT', 120000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 40, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500','https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500'], 0, 26),
('4a38e569-c673-4f9a-8eb3-a24a701a1bbb', '화이트 티셔츠', 'FASHION', 25000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 120, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500','https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500'], 0, 59),
('0bc33137-0664-45c2-8601-5f0d38e5a885', '데님 자켓', 'FASHION', 89000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 30, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500','https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500'], 0, 3),
('35310f09-5d56-4d76-ad5e-134ca24f7c2f', '가죽 핸드백', 'FASHION', 180000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 45, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500','https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'], 0, 63),
('1512d023-8d23-4a43-be96-41b022f56842', '축구공', 'SPORT', 35000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 70, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=500','https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500'], 0, 3),
('8b38b123-4dbd-48b2-9ef5-984944a96d5c', '농구공', 'SPORT', 42000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 65, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500','https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=500'], 0, 4),
('bd920033-299d-41c0-80a7-5581d286b7f9', '테니스 라켓', 'SPORT', 180000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 25, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=500','https://images.unsplash.com/photo-1617083279154-57b86ebcbeb0?w=500'], 0, 13),
('2d589c09-3caf-4634-8303-fe6aa7a6f0a4', '코카콜라 355ml', 'FOOD', 1500.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 200, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500','https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500'], 0, 44),
('dfa17a59-98e4-4844-89a5-3deb4ebd4e8a', '하리보 젤리', 'FOOD', 2500.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:05.244837+00', 140, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500','https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=500'], 0, 64),
('e064c5df-a45c-4fb2-946e-6539ce1d64d4', '청바지', 'FASHION', 65000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 80, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500','https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500'], 0, 64),
('97bf2162-134d-45e4-95b8-00608a37340e', '원피스', 'FASHION', 78000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 50, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500','https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500'], 0, 8),
('74847614-386e-4cc9-b275-1e236cc3c35c', '코트', 'FASHION', 220000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 25, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500','https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'], 0, 3),
('e21bfa60-a002-4a47-af6c-4e43b466dcba', '레더 부츠', 'FASHION', 150000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 35, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500','https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'], 0, 90),
('925e686e-c563-4c81-b292-fbf81b7d6242', '선글라스', 'FASHION', 85000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 70, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500','https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'], 0, 98),
('d99adfdd-5dee-4edf-a744-5228e9a319b6', '실크 스카프', 'FASHION', 35000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 60, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500','https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500'], 0, 28),
('b2f42001-b8a7-4911-a967-28c4f6035c74', '시계', 'FASHION', 320000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:57:14.163538+00', 40, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500','https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500'], 0, 4),
('ad94bd67-0ff6-409d-adfc-662b09d76614', '런닝화', 'SPORT', 95000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 75, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500','https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'], 0, 62),
('ede6b144-22c5-4f86-85d0-2495373921c6', '요가매트', 'SPORT', 45000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 55, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500','https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500'], 0, 72),
('d6ae6548-83fe-440a-88e4-af1bcfd7947d', '수영 고글', 'SPORT', 22000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 85, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1519315901367-57a7e2e9eebb?w=500','https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500'], 0, 99),
('c2c71183-7ef3-4e3e-ab26-4c8a99b61535', '헬스 글러브', 'SPORT', 28000.00, '2025-07-28 11:39:11.712505+00', '2025-10-26 09:58:50.964213+00', 90, NULL, NULL, ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500','https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500'], 0, 14),
('b7ceb0b8-679c-46c0-b89f-6130c007e74b', '유기농 샐러드 믹스', 'FOOD', 8000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 149, '신선한 채소를 엄선하여 만든 샐러드입니다.', 6400, ARRAY['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'], 68, 34),
('305cdfeb-dc19-4ebf-8d4c-7c6d6f5709e7', '싱싱한 노르웨이 연어', 'FOOD', 25000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 80, '신선한 노르웨이산 연어, 오메가3가 풍부합니다.', NULL, ARRAY['https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500','https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500'], 28, 43),
('55d3ebeb-6f28-4fba-a9e5-aef938f1e004', '무항생제 닭가슴살', 'FOOD', 18000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 120, '건강한 닭가슴살, 다이어트에 최적입니다.', NULL, ARRAY['https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500'], 16, 94),
('5f45c5c1-ac34-40f1-804f-ef1798b8384a', '프리미엄 한우 등심', 'FOOD', 50000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 50, '1++ 등급 한우 등심, 부드럽고 육즙이 풍부합니다.', 45000, ARRAY['https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500','https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=500'], 33, 89),
('65f7658d-4a75-4578-a8a6-f620426f6fbf', '프리미엄 김치찌개 밀키트', 'FOOD', 14000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 89, '집에서 간편하게 즐기는 김치찌개 세트입니다.', 11200, ARRAY['https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=500','https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500'], 52, 8),
('9ec007da-3d0b-4862-a62b-0bc38f3bc0ef', '국내산 제주 감귤', 'FOOD', 12000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 198, '달콤한 제주 감귤, 비타민C가 풍부합니다.', 9600, ARRAY['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500','https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500'], 89, 36),
('8753ae31-17e6-441a-a8b1-b1b607eee127', '신선한 유기농 사과', 'FOOD', 15000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 100, '청정 지역에서 재배한 달콤한 사과입니다.', 12000, ARRAY['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500','https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500'], 45, 19),
('8f98517b-e02b-47c5-9329-9efb296333cd', '고급 참치회 세트', 'FOOD', 35000.00, '2025-10-22 17:40:00.515901+00', '2025-10-25 05:37:08.276658+00', 40, '신선한 참치회, 특별한 날을 위한 선택입니다.', 31500, ARRAY['https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500'], 21, 85);

-- ============================================
-- TABLE: orders (4 rows)
-- ============================================
INSERT INTO public.orders (id, user_id, status, total_amount, customer_name, customer_email, shipping_address, payment_method, created_at, updated_at, customer_phone, shipping_postcode, payment_key, order_id, payment_status) VALUES
('8ZL5XOMS', '343b5b7c-51b7-4b39-ac55-e458ad52de40', 'pending', 12600.00, '이광수', 'lisasu94@gmail.com', '인천 서구 경서동', '토스페이먼츠', '2025-10-25 04:56:04.529276+00', '2025-10-25 04:56:04.529276+00', '01097046958', '22691', NULL, 'ORDER_1761368164682_oz0qpjfh6', 'pending'),
('CPVSAY9S', '343b5b7c-51b7-4b39-ac55-e458ad52de40', 'payment_confirmed', 12600.00, '이광수', 'lisasu94@gmail.com', '인천 서구 경서동', '토스페이먼츠', '2025-10-25 04:56:34.686228+00', '2025-10-25 04:57:06.917645+00', '01097046958', '22691', 'tviva20251025135635XObL9', 'ORDER_1761368195297_pehstg3ds', 'paid'),
('4YQKTNXS', '343b5b7c-51b7-4b39-ac55-e458ad52de40', 'payment_confirmed', 14200.00, '이광수', 'lisasu94@gmail.com', '인천 서구 경서동', '토스페이먼츠', '2025-10-25 04:58:08.493117+00', '2025-10-25 05:01:47.805474+00', '01097046958', '22691', 'tviva20251025135809YhZr7', 'ORDER_1761368288135_g9pnn7bv8', 'failed'),
('DR9ZB0YS', '343b5b7c-51b7-4b39-ac55-e458ad52de40', 'payment_confirmed', 9400.00, '이광수', 'lisasu94@gmail.com', '인천 서구 경서동', '토스페이먼츠', '2025-10-25 05:03:06.976412+00', '2025-10-25 05:03:33.802082+00', '01097046958', '22691', 'tviva20251025140307Yiot9', 'ORDER_1761368587188_wvyuobo4n', 'paid');

-- ============================================
-- TABLE: order_items (4 rows)
-- ============================================
INSERT INTO public.order_items (id, order_id, product_id, quantity, price, created_at) VALUES
('c5301bb3-8290-4a0b-8010-62bc8a6131eb', '8ZL5XOMS', '9ec007da-3d0b-4862-a62b-0bc38f3bc0ef', 1, 9600.00, '2025-10-25 04:56:04.584296+00'),
('a860424c-039e-4c01-863f-4344e530388c', 'CPVSAY9S', '9ec007da-3d0b-4862-a62b-0bc38f3bc0ef', 1, 9600.00, '2025-10-25 04:56:34.726368+00'),
('f6b1627b-846b-4566-a489-f633cfbf18d4', '4YQKTNXS', '65f7658d-4a75-4578-a8a6-f620426f6fbf', 1, 11200.00, '2025-10-25 04:58:08.539994+00'),
('b165cad0-3560-4e51-afb5-a92560694202', 'DR9ZB0YS', 'b7ceb0b8-679c-46c0-b89f-6130c007e74b', 1, 6400.00, '2025-10-25 05:03:07.061841+00');

-- ============================================
-- TABLE: reviews (3 rows)
-- ============================================
INSERT INTO public.reviews (id, product_id, user_id, user_name, content, images, created_at, updated_at) VALUES
('ab8dfc6d-352a-4133-9a5f-6e42edd92b3f', '55d3ebeb-6f28-4fba-a9e5-aef938f1e004', '343b5b7c-51b7-4b39-ac55-e458ad52de40', '박서준', '기대 이상이었어요. 가격 대비 품질이 훌륭합니다. 강력 추천합니다!', ARRAY['https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300'], '2025-10-22 17:51:16.929536+00', '2025-10-22 17:51:16.929536+00'),
('a7a6e24e-f874-4d57-b52a-bfc4785e9d12', 'b7ceb0b8-679c-46c0-b89f-6130c007e74b', '343b5b7c-51b7-4b39-ac55-e458ad52de40', '이지은', '가족들이 모두 만족했습니다. 품질이 정말 좋네요. 다음에도 구매하겠습니다!', ARRAY[]::text[], '2025-10-22 17:51:16.929536+00', '2025-10-22 17:51:16.929536+00'),
('db391a9e-8e6c-4954-8658-a8106d3d1688', '5f45c5c1-ac34-40f1-804f-ef1798b8384a', '343b5b7c-51b7-4b39-ac55-e458ad52de40', '김민수', '정말 신선하고 맛있어요! 배송도 빠르고 포장도 깔끔했습니다. 재구매 의사 100%입니다.', ARRAY['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300'], '2025-10-22 17:51:16.929536+00', '2025-10-22 17:51:16.929536+00');

-- ============================================
-- EMPTY TABLES (no data to backup)
-- ============================================
-- TABLE: cart_items (0 rows)
-- TABLE: wishlist (0 rows)
-- TABLE: users (0 rows)

-- ============================================
-- RE-ENABLE TRIGGERS
-- ============================================
SET session_replication_role = DEFAULT;

-- ============================================
-- MIGRATION HISTORY
-- ============================================
-- The following migrations have been applied to this database.
-- To restore this backup, first apply all migrations in order, then run this SQL file.

-- Migration 1: 20251022054919 - create_commerce_user_table
-- Migration 2: 20251022164256 - update_products_table_for_commerce
-- Migration 3: 20251022164313 - create_reviews_table
-- Migration 4: 20251022164330 - create_review_count_trigger
-- Migration 5: 20251023072400 - create_cart_items_table
-- Migration 6: 20251023131355 - create_wishlist_table
-- Migration 7: 20251024153112 - add_payment_columns_to_orders
-- Migration 8: 20251025045120 - fix_orders_foreign_key_with_cleanup
-- Migration 9: 20251025053708 - add_sales_count_and_update_categories
-- Migration 10: 20251027074008 - fix_security_issues (최신 보안 수정 포함)

-- ============================================
-- BACKUP SUMMARY
-- ============================================
-- Total tables: 8
-- Tables with data: 5
-- Empty tables: 3
-- Total rows backed up: 61
--   - commerce_user: 2 rows
--   - products: 48 rows
--   - orders: 4 rows
--   - order_items: 4 rows
--   - reviews: 3 rows
-- Total functions: 4
-- Total triggers: 5
-- Database size: ~1.1 MB

-- ============================================
-- RESTORE INSTRUCTIONS
-- ============================================
-- 1. Create a new Supabase project or ensure target database is empty
-- 2. Apply all migrations in order (see migration history above)
-- 3. Run this SQL file: psql -h [HOST] -U postgres -d postgres -f database_backup_20251027.sql
-- 4. Verify data integrity by checking row counts
-- 5. Test application functionality

-- END OF BACKUP
