import pandas as pd

# Load datasets from archive folder
fake_df = pd.read_csv("data/archive/Fake.csv")
real_df = pd.read_csv("data/archive/True.csv")

print("Fake dataset shape:", fake_df.shape)
print("Real dataset shape:", real_df.shape)

# Add labels
fake_df['label'] = 0   # 0 = Fake
real_df['label'] = 1   # 1 = Real

# Keep only required columns
fake_df = fake_df[['title', 'text', 'label']]
real_df = real_df[['title', 'text', 'label']]

# Merge datasets
merged_df = pd.concat([fake_df, real_df], axis=0)

# Shuffle the merged dataset
merged_df = merged_df.sample(frac=1, random_state=42).reset_index(drop=True)

print("Merged dataset shape:", merged_df.shape)
print(merged_df.head())

# Save merged dataset
merged_df.to_csv("data/merged_fake_news.csv", index=False)

print("\n✅ Merged dataset saved as: data/merged_fake_news.csv")
