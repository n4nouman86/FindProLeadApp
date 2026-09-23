IF OBJECT_ID(N'[dbo].[AutoLeads]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[AutoLeads](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [RowId] [uniqueidentifier] NOT NULL CONSTRAINT [DF_AutoLeads_RowId] DEFAULT NEWID(),
        [FirstName] [varchar](50) NOT NULL,
        [LastName] [varchar](50) NOT NULL,
        [Phone] [varchar](50) NOT NULL,
        [Email] [varchar](50) NULL,
        [DateOfBirth] [date] NOT NULL,
        [AutoInsuranceAgencyId] [int] NOT NULL,
        [VerifierCompanyId] [int] NULL,
        [AppUserId] [nvarchar](450) NOT NULL,
        CONSTRAINT [PK_AutoLeads] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AutoLeads_AutoInsuranceAgencies_AutoInsuranceAgencyId]
            FOREIGN KEY ([AutoInsuranceAgencyId]) REFERENCES [dbo].[AutoInsuranceAgencies] ([Id]),
        CONSTRAINT [FK_AutoLeads_VerifierCompanies_VerifierCompanyId]
            FOREIGN KEY ([VerifierCompanyId]) REFERENCES [dbo].[VerifierCompanies] ([Id]),
        CONSTRAINT [FK_AutoLeads_AspNetUsers_AppUserId]
            FOREIGN KEY ([AppUserId]) REFERENCES [dbo].[AspNetUsers] ([Id])
    );

    CREATE UNIQUE INDEX [IX_AutoLeads_RowId] ON [dbo].[AutoLeads] ([RowId]);
    CREATE INDEX [IX_AutoLeads_AutoInsuranceAgencyId] ON [dbo].[AutoLeads] ([AutoInsuranceAgencyId]);
    CREATE INDEX [IX_AutoLeads_VerifierCompanyId] ON [dbo].[AutoLeads] ([VerifierCompanyId]);
    CREATE INDEX [IX_AutoLeads_AppUserId] ON [dbo].[AutoLeads] ([AppUserId]);
END;
GO