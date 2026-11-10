-- =====================================================================
-- Migration Script: BE-05 – Bổ sung service_id và liên kết cho appointments
-- Database: clinic_managerment
-- Lưu ý: Thực thi file này bằng SSMS hoặc sqlcmd trên môi trường của bạn
-- =====================================================================

USE [clinic_managerment];
GO

-- 1. Bổ sung cột service_id vào bảng appointments nếu chưa tồn tại
IF NOT EXISTS (
    SELECT 1 
    FROM sys.columns 
    WHERE object_id = OBJECT_ID(N'[dbo].[appointments]') 
      AND name = N'service_id'
)
BEGIN
    ALTER TABLE [dbo].[appointments]
    ADD [service_id] BIGINT NULL;
    PRINT N'Đã thêm cột service_id vào bảng appointments.';
END
ELSE
BEGIN
    PRINT N'Cột service_id đã tồn tại trong bảng appointments.';
END
GO

-- 2. Thêm khóa ngoại FK_appointments_service liên kết sang clinical_services(id)
IF NOT EXISTS (
    SELECT 1 
    FROM sys.foreign_keys 
    WHERE object_id = OBJECT_ID(N'[dbo].[FK_appointments_service]')
)
BEGIN
    ALTER TABLE [dbo].[appointments]
    ADD CONSTRAINT [FK_appointments_service] FOREIGN KEY ([service_id])
    REFERENCES [dbo].[clinical_services]([id]);
    PRINT N'Đã tạo khóa ngoại FK_appointments_service.';
END
ELSE
BEGIN
    PRINT N'Khóa ngoại FK_appointments_service đã tồn tại.';
END
GO

-- 3. Tạo chỉ mục tối ưu truy vấn theo service_id và chống đặt trùng lịch
IF NOT EXISTS (
    SELECT 1 
    FROM sys.indexes 
    WHERE object_id = OBJECT_ID(N'[dbo].[appointments]') 
      AND name = N'IX_appointments_service_id'
)
BEGIN
    CREATE NONCLUSTERED INDEX [IX_appointments_service_id] 
    ON [dbo].[appointments] ([service_id]);
    PRINT N'Đã tạo chỉ mục IX_appointments_service_id.';
END
GO

IF NOT EXISTS (
    SELECT 1 
    FROM sys.indexes 
    WHERE object_id = OBJECT_ID(N'[dbo].[appointments]') 
      AND name = N'IX_appointments_phone_date_time'
)
BEGIN
    CREATE NONCLUSTERED INDEX [IX_appointments_phone_date_time] 
    ON [dbo].[appointments] ([phone], [appointment_date], [appointment_time]);
    PRINT N'Đã tạo chỉ mục IX_appointments_phone_date_time.';
END
GO

