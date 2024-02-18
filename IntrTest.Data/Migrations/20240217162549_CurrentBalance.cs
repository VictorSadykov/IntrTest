using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IntrTest.Data.Migrations
{
    /// <inheritdoc />
    public partial class CurrentBalance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Sum",
                table: "AspNetUsers",
                newName: "CurrentBalance");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CurrentBalance",
                table: "AspNetUsers",
                newName: "Sum");
        }
    }
}
