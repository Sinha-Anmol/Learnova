using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduPortalAPI.Migrations
{
    /// <inheritdoc />
    public partial class FullCourseFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FullCourseFiles_FullCourses_CourseId",
                table: "FullCourseFiles");

            migrationBuilder.DropColumn(
                name: "UploadedDate",
                table: "FullCourseFiles");

            migrationBuilder.RenameColumn(
                name: "CourseId",
                table: "FullCourseFiles",
                newName: "FullCourseId");

            migrationBuilder.RenameIndex(
                name: "IX_FullCourseFiles_CourseId",
                table: "FullCourseFiles",
                newName: "IX_FullCourseFiles_FullCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_FullCourseFiles_FullCourses_FullCourseId",
                table: "FullCourseFiles",
                column: "FullCourseId",
                principalTable: "FullCourses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FullCourseFiles_FullCourses_FullCourseId",
                table: "FullCourseFiles");

            migrationBuilder.RenameColumn(
                name: "FullCourseId",
                table: "FullCourseFiles",
                newName: "CourseId");

            migrationBuilder.RenameIndex(
                name: "IX_FullCourseFiles_FullCourseId",
                table: "FullCourseFiles",
                newName: "IX_FullCourseFiles_CourseId");

            migrationBuilder.AddColumn<DateTime>(
                name: "UploadedDate",
                table: "FullCourseFiles",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddForeignKey(
                name: "FK_FullCourseFiles_FullCourses_CourseId",
                table: "FullCourseFiles",
                column: "CourseId",
                principalTable: "FullCourses",
                principalColumn: "CourseId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
