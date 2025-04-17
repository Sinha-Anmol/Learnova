using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class PremiumCourses2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StripePaymentIntentId",
                table: "PremiumPayments",
                newName: "PaymentId");

            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "PremiumPayments",
                newName: "PaymentDateTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaymentId",
                table: "PremiumPayments",
                newName: "StripePaymentIntentId");

            migrationBuilder.RenameColumn(
                name: "PaymentDateTime",
                table: "PremiumPayments",
                newName: "PaymentDate");
        }
    }
}
