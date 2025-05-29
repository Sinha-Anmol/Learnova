using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class FullCourse : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FullCourses",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KeyTopics = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TeacherEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FullCourses", x => x.CourseId);
                });

            migrationBuilder.CreateTable(
                name: "FullCourseFiles",
                columns: table => new
                {
                    FileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    FileType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UploadedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FullCourseFiles", x => x.FileId);
                    table.ForeignKey(
                        name: "FK_FullCourseFiles_FullCourses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "FullCourses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FullCourseFiles_CourseId",
                table: "FullCourseFiles",
                column: "CourseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FullCourseFiles");

            migrationBuilder.DropTable(
                name: "FullCourses");
        }
    }
}
