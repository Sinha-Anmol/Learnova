using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class LearnovaCourses : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LearnovaCourses",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KeyTopics = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Domain = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TeacherEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearnovaCourses", x => x.CourseId);
                });

            migrationBuilder.CreateTable(
                name: "LearnovaCourseVideos",
                columns: table => new
                {
                    VideoId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LearnovaCourseVideos", x => x.VideoId);
                    table.ForeignKey(
                        name: "FK_LearnovaCourseVideos_LearnovaCourses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "LearnovaCourses",
                        principalColumn: "CourseId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LearnovaCourseVideos_CourseId",
                table: "LearnovaCourseVideos",
                column: "CourseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LearnovaCourseVideos");

            migrationBuilder.DropTable(
                name: "LearnovaCourses");
        }
    }
}
