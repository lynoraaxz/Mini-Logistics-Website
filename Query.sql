create database LogisticsDB;

use LogisticsDB;

create table stock (
StockID int identity(1,1) primary key, 
ItemName nvarchar(100), 
Quantity int, 
Location nvarchar(50));

create table employee (
EmployeeId int identity primary key, 
Name nvarchar(100),
Position nvarchar(100), 
Username nvarchar(50), 
Password nvarchar(255));

exec sp_rename 'employee', 'employees';

select *
from employees;

alter table employees 
alter column Name Nvarchar(100) not null;

alter table employees 
alter column Username Nvarchar(50) not null;

alter table employees 
add constraint UQ_employees_Username unique(username);

alter table employees 
alter column Position nvarchar(100) not null;

alter table employees 
alter column Password nvarchar(255) not null;

create table StockTransaction (
TransactionID int primary key identity, 
TransactionDate date not null,
Type Nvarchar(10) not null, 
Quantity int not null);

insert into StockTransaction 
(TransactionDate, Type, Quantity)
values 
('2025-09-01', 'IN', 100),
('2025-09-02', 'OUT', 30),
('2025-09-03', 'IN', 50),
('2025-09-04', 'OUT', 20),
('2025-09-05', 'IN', 70),
('2025-09-06', 'OUT', 40),
('2025-09-07', 'IN', 90),
('2025-09-08', 'OUT', 25),
('2025-09-09', 'IN', 120),
('2025-09-10', 'OUT', 60);

insert into StockTransaction 
(TransactionDate, Type, Quantity)
values 
('2025-08-01', 'IN', 100),
('2025-08-02', 'OUT', 30),
('2025-08-03', 'IN', 50),
('2025-08-04', 'OUT', 200),
('2025-07-05', 'IN', 70),
('2025-07-06', 'OUT', 40),
('2025-07-07', 'IN', 90),
('2025-07-08', 'OUT', 250),
('2025-06-09', 'IN', 120),
('2025-06-10', 'OUT', 300);


select 
format(TransactionDate, 'MMM') as month,
sum(case when Type = 'IN' then Quantity else 0 end) as StockIn,
SUM(case when Type = 'OUT' then Quantity else 0 end) as StockOut
from StockTransaction
group by format(TransactionDate, 'MMM')
order by min(TransactionDate);

create table Shipment (
ShipmentID int primary key identity,
ShipmentDate DATE NOT NULL,
ShipmentType NVARCHAR(10) NOT NULL,   -- IN or OUT
PartnerName NVARCHAR(100) NOT NULL,   -- Supplier (for IN) / Customer (for OUT)
ItemName NVARCHAR(100) NOT NULL,
Quantity INT NOT NULL,
Status NVARCHAR(50) NOT NULL          -- Pending, In Transit, Delivered, Received
);

INSERT INTO Shipment (
    ShipmentDate,
    ShipmentType,
    PartnerName,
    ItemName,
    Quantity,
    Status
)
VALUES (
    GETDATE(),               -- today’s date
    'IN',                    -- or 'OUT'
    'PT Supplier Jaya',      -- Supplier (if IN) or Customer (if OUT)
    'Steel Rods',            -- Item name
    500,                     -- Quantity
    'Pending'                -- Status
);

INSERT INTO Shipment (
    ShipmentDate,
    ShipmentType,
    PartnerName,
    ItemName,
    Quantity,
    Status
)
VALUES (
    '2025-09-27',
    'OUT',
    'XYZ Construction',
    'Cement Bag',
    50,
    'Delivered'
);



SELECT 
    ShipmentType,
    COUNT(*) AS TotalShipments,
    SUM(Quantity) AS TotalQuantity
FROM Shipment
WHERE ShipmentDate >= DATEADD(DAY, -7, CAST(GETDATE() AS DATE))
GROUP BY ShipmentType;
