import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getSlide } from '@/utils/queries/appQueries';

const { width } = Dimensions.get('window');

const SlideComponent = () => {
  const {
    data: slidesData,
    isLoading: isLoadingSlides,
    error: errorSlides,
  } = useQuery({
    queryKey: ['slides'],
    queryFn: () => getSlide(),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  // Auto-scroll slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1 < slidesData?.data?.length ? prevIndex + 1 : 0;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 4000); // Adjust timing as needed
    return () => clearInterval(interval);
  }, [slidesData]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };

  if (isLoadingSlides) return <Text>Loading...</Text>;
  if (errorSlides) return <Text>Error loading slides</Text>;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        {slidesData?.data?.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri: slide.image }} // Replace with your image URL
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slidesData?.data?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 56,
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: width * 0.5,
    borderRadius: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007aff',
  },
  inactiveDot: {
    backgroundColor: '#d3d3d3',
  },
});

export default SlideComponent;
