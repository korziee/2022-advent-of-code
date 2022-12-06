#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int cmpfunc(const void *a, const void *b)
{
  return (*(char *)a - *(char *)b);
}

int main()
{
  FILE *file = fopen("./input", "r");

  if (file == NULL)
  {
    printf("Error opening file!\n");
    return 1;
  }

  int buf_index = 0;
  char buffer[4] = {0, 0, 0, 0};
  int distance_from_start = 0;
  char c;

  while ((c = fgetc(file)) != EOF)
  {
    buffer[buf_index] = c;
    buf_index++;
    distance_from_start++;

    if (buf_index > 3)
    {
      // move index back to 0 if we've wrapped.
      buf_index = 0;
    }

    if (buffer[3] != 0)
    {
      // 1 byte longer so we can add null terminator otherwise memcpy gets weird
      char buf_copy[5] = {0, 0, 0, 0, 0};
      // take copy of buffer so we can sort later
      memcpy(buf_copy, buffer, 4);
      // sort the copy
      qsort(buf_copy, 4, sizeof(char), cmpfunc);
      // if any of the sibling are equal, it means we have a duplicate, ergo => non unique value in buffer
      if ((buf_copy[0] != buf_copy[1]) && (buf_copy[1] != buf_copy[2]) && (buf_copy[2] != buf_copy[3]))
      {
        printf("marker hit. distance_from_start = %i\n", distance_from_start);
      }
    }
  }

  fclose(file);
  return 0;
}