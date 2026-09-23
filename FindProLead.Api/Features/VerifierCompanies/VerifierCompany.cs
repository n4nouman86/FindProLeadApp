using System.ComponentModel.DataAnnotations;

namespace FindProLead.Api.Features.VerifierCompanies;

public class VerifierCompany
{
    public int Id { get; set; }
    public Guid RowId { get; set; } = Guid.NewGuid();

    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(50)]
    public string? Website { get; set; }

    [MaxLength(50)]
    public string? Email { get; set; }

    [MaxLength(256)]
    public string? Linkedin { get; set; }

    [MaxLength(256)]
    public string? Memo { get; set; }

    public DateTimeOffset CreatedOn { get; set; } = DateTimeOffset.UtcNow;
}
