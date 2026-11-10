-- Script tạo bảng staff_access_logs phục vụ Issue BE-03
-- Cho phép chạy lại nhiều lần an toàn (idempotent)

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'staff_access_logs' AND type = 'U')
BEGIN
    CREATE TABLE staff_access_logs (
        id BIGINT IDENTITY(1,1) NOT NULL,
        staff_id BIGINT NULL,
        username NVARCHAR(80) NOT NULL,
        activity VARCHAR(20) NOT NULL,
        status VARCHAR(10) NOT NULL,
        access_time DATETIME2 NOT NULL,
        ip_address VARCHAR(45) NULL,
        device NVARCHAR(50) NULL,
        browser NVARCHAR(100) NULL,
        page_path NVARCHAR(300) NULL,
        CONSTRAINT PK_staff_access_logs PRIMARY KEY CLUSTERED (id ASC),
        CONSTRAINT FK_staff_access_logs_staff_users FOREIGN KEY (staff_id) REFERENCES staff_users(id) ON DELETE SET NULL
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_staff_access_logs_staff_time' AND object_id = OBJECT_ID('staff_access_logs'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_staff_access_logs_staff_time 
    ON staff_access_logs (staff_id, access_time DESC);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_staff_access_logs_access_time' AND object_id = OBJECT_ID('staff_access_logs'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_staff_access_logs_access_time 
    ON staff_access_logs (access_time DESC);
END;

