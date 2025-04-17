using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class PhoneNumber2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PhNumber",
                table: "Users",
                newName: "phno");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Users",
                newName: "name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "phno",
                table: "Users",
                newName: "PhNumber");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "FullName");
        }
    }
}
