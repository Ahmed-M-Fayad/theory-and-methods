"""
Test script for the Sampler class using the Iris dataset.
"""
import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from collections import Counter

from sampler import Sampler


def test_all_sampling_methods(sampler, data, labels):
    """Test all sampling methods and visualize in a single figure."""
    print("\n" + "="*60)
    print("TESTING ALL SAMPLING METHODS")
    print("="*60)
    
    # Prepare PCA for visualization
    pca = PCA(n_components=2)
    data_2d = pca.fit_transform(data)
    
    # Create a large figure with subplots
    fig = plt.figure(figsize=(18, 8))
    
    # ==================== Original Data ====================
    ax1 = plt.subplot(2, 3, 1)
    scatter = ax1.scatter(data_2d[:, 0], data_2d[:, 1], c=labels, 
                         cmap='viridis', alpha=0.6, edgecolors='k', s=50)
    ax1.set_title('Original Data\n(n=150)', fontsize=12, fontweight='bold')
    ax1.set_xlabel('PC1')
    ax1.set_ylabel('PC2')
    ax1.grid(True, alpha=0.3)
    plt.colorbar(scatter, ax=ax1, label='Class')
    
    # ==================== Random Sampling ====================
    print("\n1. Random Sampling:")
    n_samples = 30
    sampled_random = sampler.random_sampling(data, n_samples)
    sampled_random_2d = pca.transform(sampled_random)
    
    ax2 = plt.subplot(2, 3, 2)
    ax2.scatter(data_2d[:, 0], data_2d[:, 1], c='lightgray', 
               alpha=0.3, s=30, label='Original')
    ax2.scatter(sampled_random_2d[:, 0], sampled_random_2d[:, 1], 
               c='red', alpha=0.8, edgecolors='k', s=100, label='Sampled')
    ax2.set_title(f'Random Sampling\n(n={n_samples})', fontsize=12, fontweight='bold')
    ax2.set_xlabel('PC1')
    ax2.set_ylabel('PC2')
    ax2.grid(True, alpha=0.3)
    ax2.legend()
    
    print(f"   Sampled: {len(sampled_random)} points")
    
    # ==================== Stratified Sampling ====================
    print("\n2. Stratified Sampling:")
    n_samples_per_class = 10
    sampled_stratified = sampler.stratified_sampling(data, labels, n_samples_per_class)
    sampled_stratified_2d = pca.transform(sampled_stratified)
    
    # Get labels for sampled data
    sampled_indices = []
    for sample in sampled_stratified:
        for i, original in enumerate(data):
            if np.array_equal(sample, original):
                sampled_indices.append(i)
                break
    sampled_labels = [labels[i] for i in sampled_indices]
    
    ax3 = plt.subplot(2, 3, 3)
    ax3.scatter(data_2d[:, 0], data_2d[:, 1], c='lightgray', 
               alpha=0.3, s=30, label='Original')
    scatter3 = ax3.scatter(sampled_stratified_2d[:, 0], sampled_stratified_2d[:, 1], 
                          c=sampled_labels, cmap='viridis', alpha=0.8, 
                          edgecolors='k', s=100, label='Sampled')
    ax3.set_title(f'Stratified Sampling\n(n={len(sampled_stratified)})', 
                 fontsize=12, fontweight='bold')
    ax3.set_xlabel('PC1')
    ax3.set_ylabel('PC2')
    ax3.grid(True, alpha=0.3)
    ax3.legend()
    
    print(f"   Samples per class: {n_samples_per_class}")
    print(f"   Original distribution: {dict(Counter(labels))}")
    print(f"   Sampled distribution: {dict(Counter(sampled_labels))}")
    
    # ==================== Clustered Sampling ====================
    print("\n3. Clustered Sampling:")
    n_clusters = 3
    clusters = sampler.clustered_sampling(data, n_clusters)
    
    ax4 = plt.subplot(2, 3, 4)
    ax4.scatter(data_2d[:, 0], data_2d[:, 1], c='lightgray', 
               alpha=0.3, s=30, label='Original')
    
    colors = ['red', 'blue', 'green', 'orange', 'purple']
    for i, cluster in enumerate(clusters):
        cluster_2d = pca.transform(cluster)
        ax4.scatter(cluster_2d[:, 0], cluster_2d[:, 1], 
                   c=colors[i % len(colors)], label=f'Cluster {i}',
                   alpha=0.7, edgecolors='k', s=80)
    
    ax4.set_title(f'Clustered Sampling\n(k={n_clusters})', 
                 fontsize=12, fontweight='bold')
    ax4.set_xlabel('PC1')
    ax4.set_ylabel('PC2')
    ax4.grid(True, alpha=0.3)
    ax4.legend()
    
    print(f"   Number of clusters: {n_clusters}")
    print(f"   Cluster sizes: {[len(c) for c in clusters]}")
    
    # ==================== Multi-Stage Sampling ====================
    print("\n4. Multi-Stage Sampling:")
    n_clusters_ms = 3
    n_samples_per_cluster = 5
    sampled_multistage = sampler.multi_stage_sampling(data, n_clusters_ms, n_samples_per_cluster)
    sampled_multistage_2d = pca.transform(sampled_multistage)
    
    ax5 = plt.subplot(2, 3, 6)
    ax5.scatter(data_2d[:, 0], data_2d[:, 1], c='lightgray', 
               alpha=0.3, s=30, label='Original')
    ax5.scatter(sampled_multistage_2d[:, 0], sampled_multistage_2d[:, 1], 
               c='purple', alpha=0.8, edgecolors='k', s=100, label='Sampled')
    ax5.set_title(f'Multi-Stage Sampling\n(n={len(sampled_multistage)})', 
                 fontsize=12, fontweight='bold')
    ax5.set_xlabel('PC1')
    ax5.set_ylabel('PC2')
    ax5.grid(True, alpha=0.3)
    ax5.legend()
    
    print(f"   Clusters: {n_clusters_ms}, Samples/cluster: {n_samples_per_cluster}")
    print(f"   Total samples: {len(sampled_multistage)}")
    
    plt.suptitle('Sampling Methods Comparison on Iris Dataset', 
                fontsize=16, fontweight='bold', y=0.98)
    plt.tight_layout(rect=[0, 0, 1, 0.96])
    plt.savefig("all_sampling_methods_comparison.png", dpi=150, bbox_inches='tight')
    plt.show()
    
    print("\n" + "="*60)
    print("Visualization saved as: all_sampling_methods_comparison.png")
    print("="*60)


def main():
    """Main function to run all tests."""
    print("="*60)
    print("SAMPLER CLASS TESTING WITH IRIS DATASET")
    print("="*60)
    
    # Load Iris dataset
    iris = load_iris()
    data = iris.data
    labels = iris.target
    
    print(f"\nDataset Information:")
    print(f"  Name: Iris")
    print(f"  Total samples: {len(data)}")
    print(f"  Features: {iris.feature_names}")
    print(f"  Classes: {list(iris.target_names)}")
    print(f"  Class distribution: {dict(Counter(labels))}")
    
    # Initialize sampler
    sampler = Sampler(random_state=42)
    
    # Run all tests with unified visualization
    test_all_sampling_methods(sampler, data, labels)
    
    print("\n" + "="*60)
    print("ALL TESTS COMPLETED!")
    print("="*60)


if __name__ == "__main__":
    main()