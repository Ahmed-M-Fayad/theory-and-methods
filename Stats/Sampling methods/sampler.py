import random as rnd
from typing import List
import numpy as np
from sklearn.cluster import KMeans


class Sampler:
    """A class for various sampling strategies on datasets."""
    
    def __init__(self, random_state: int = 42):
        """
        Initialize the Sampler.
        
        Args:
            random_state: Random seed for reproducibility
        """
        self.random_state = random_state
        rnd.seed(random_state)
    
    def random_sampling(self, data: np.ndarray, n_samples: int) -> np.ndarray:
        """
        Randomly sample n_samples from the dataset.
        
        Args:
            data: Input data array
            n_samples: Number of samples to return
            
        Returns:
            Sampled data array
        """
        if n_samples > len(data):
            raise ValueError(f"n_samples ({n_samples}) cannot exceed data size ({len(data)})")
        
        indices = rnd.sample(range(len(data)), n_samples)
        return data[indices]
    
    def stratified_sampling(self, data: np.ndarray, labels: List, n_samples_per_class: int) -> np.ndarray:
        """
        Stratified sampling to maintain class distribution.
        
        Args:
            data: Input data array
            labels: Class labels for each data point
            n_samples_per_class: Number of samples to draw from each class
            
        Returns:
            Sampled data array with stratified distribution
        """
        unique_classes = set(labels)
        sampled_indices = []
        
        for cls in unique_classes:
            class_indices = [i for i, label in enumerate(labels) if label == cls]
            
            if n_samples_per_class > len(class_indices):
                raise ValueError(
                    f"n_samples_per_class ({n_samples_per_class}) exceeds "
                    f"available samples for class {cls} ({len(class_indices)})"
                )
            
            sampled_indices.extend(rnd.sample(class_indices, n_samples_per_class))
        
        return data[sampled_indices]
    
    def clustered_sampling(self, data: np.ndarray, n_clusters: int) -> List[np.ndarray]:
        """
        Clustered sampling using KMeans clustering.
        
        Args:
            data: Input data array
            n_clusters: Number of clusters to create
            
        Returns:
            List of clusters, where each cluster is an array of data points
        """
        if n_clusters < 2:
            raise ValueError("n_clusters must be at least 2")
        
        if n_clusters > len(data):
            raise ValueError(f"n_clusters ({n_clusters}) cannot exceed data size ({len(data)})")
        
        # Fit KMeans with specified number of clusters
        kmeans = KMeans(n_clusters=n_clusters, random_state=self.random_state, n_init=10)
        kmeans.fit(data)
        
        # Group data points by cluster
        clusters = {i: [] for i in range(n_clusters)}
        for idx, label in enumerate(kmeans.labels_):
            clusters[label].append(data[idx])
        
        # Convert to arrays and return non-empty clusters
        return [np.array(cluster) for cluster in clusters.values() if cluster]
    
    def multi_stage_sampling(
        self, 
        data: np.ndarray, 
        n_clusters: int, 
        n_samples_per_cluster: int
    ) -> np.ndarray:
        """
        Multi-stage sampling: first cluster the data, then sample from each cluster.
        
        Args:
            data: Input data array
            n_clusters: Number of clusters to create
            n_samples_per_cluster: Number of samples to draw from each cluster
            
        Returns:
            Combined sampled data from all clusters
        """
        # First stage: cluster the data
        clusters = self.clustered_sampling(data, n_clusters)
        
        # Second stage: sample from each cluster
        all_samples = []
        for cluster in clusters:
            if len(cluster) < n_samples_per_cluster:
                # If cluster is too small, take all points
                all_samples.append(cluster)
            else:
                sampled = self.random_sampling(cluster, n_samples_per_cluster)
                all_samples.append(sampled)
        
        return np.vstack(all_samples)