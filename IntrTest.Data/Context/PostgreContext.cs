using IntrTest.Data.Models.Database;
using IntrTest.Data.Models.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntrTest.Data.Context
{
    public class PostgreContext : IdentityDbContext<User, IdentityRole, string>
    {
        public DbSet<Coin> Coins { get; set; }
        public DbSet<UserCoin> UserCoins { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserDrink> UserDrinks { get; set; }
        public DbSet<Drink> Drinks { get; set; }

        public PostgreContext(DbContextOptions<PostgreContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            CreateDefaultData(builder);
            base.OnModelCreating(builder);
        }

        private void CreateDefaultData(ModelBuilder builder)
        {
            builder.Entity<Coin>().HasData(
                new Coin[]
                {
                    new Coin {Value = 1, Amount = 5, isBlocked = false},
                    new Coin {Value = 2, Amount = 5, isBlocked = false},
                    new Coin {Value = 5, Amount = 5, isBlocked = false},
                    new Coin {Value = 10, Amount = 5, isBlocked = false},
                });
        }

        public async override Task<int> SaveChangesAsync(CancellationToken ct = default)
        {
            GenerateCreateUpdateDate();
            return await base.SaveChangesAsync(ct);
        }

        private void GenerateCreateUpdateDate()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is IEntityBase<int> || e.Entity is IEntityBase<string> && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                if (entityEntry.Entity is IEntityBase<int>)
                    ((IEntityBase<int>)entityEntry.Entity).UpdateDate = DateTime.Now;

                if (entityEntry.Entity is IEntityBase<string>)
                    ((IEntityBase<string>)entityEntry.Entity).UpdateDate = DateTime.Now;

                if (entityEntry.State == EntityState.Added)
                {
                    if (entityEntry.Entity is IEntityBase<int>)
                        ((IEntityBase<int>)entityEntry.Entity).CreateDate = DateTime.Now;

                    if (entityEntry.Entity is IEntityBase<string>)
                        ((IEntityBase<string>)entityEntry.Entity).CreateDate = DateTime.Now;
                }
            }
        }
    }
}
