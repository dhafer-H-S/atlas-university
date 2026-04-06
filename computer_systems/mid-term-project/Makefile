CXX      := g++
CXXFLAGS := -O2 -std=c++17 -Wall -Wextra
TARGET   := cache_lab
SRCDIR   := src
SRCS     := $(wildcard $(SRCDIR)/*.cpp)
OBJS     := $(SRCS:.cpp=.o)

.PHONY: all clean run run-stride run-workingset run-matrix run-linkedlist run-bandwidth plot

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $@ $^

$(SRCDIR)/%.o: $(SRCDIR)/%.cpp
	$(CXX) $(CXXFLAGS) -c -o $@ $<

run: $(TARGET)
	./$(TARGET) all

run-stride: $(TARGET)
	./$(TARGET) stride

run-workingset: $(TARGET)
	./$(TARGET) workingset

run-matrix: $(TARGET)
	./$(TARGET) matrix

run-linkedlist: $(TARGET)
	./$(TARGET) linkedlist

run-bandwidth: $(TARGET)
	./$(TARGET) bandwidth

plot:
	python3 scripts/plot_results.py --experiment all

clean:
	rm -f $(SRCDIR)/*.o $(TARGET)
	rm -f results/*.csv results/figures/*.png
