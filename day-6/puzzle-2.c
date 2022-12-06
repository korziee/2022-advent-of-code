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
  char buffer[14];

  // zero out buffer
  for (size_t i = 0; i < sizeof(buffer); i++)
  {
    buffer[i] = 0;
  }

  int distance_from_start = 0;
  char c;

  while ((c = fgetc(file)) != EOF)
  {
    buffer[buf_index] = c;
    buf_index++;
    distance_from_start++;

    if (buf_index >= sizeof(buffer))
    {
      // move index back to 0 if we've wrapped.
      buf_index = 0;
    }

    if (buffer[sizeof(buffer) - 1] != 0)
    {
      // 1 byte longer so we can add null terminator otherwise memcpy gets weird
      char buf_copy[sizeof(buffer) + 1];
      // zero out buffer copy
      for (size_t i = 0; i < sizeof(buf_copy); i++)
      {
        buf_copy[i] = 0;
      }
      // take copy of buffer so we can sort later
      memcpy(buf_copy, buffer, sizeof(buffer));
      // sort the copy
      qsort(buf_copy, sizeof(buffer), sizeof(char), cmpfunc);

      int all_descending = 1;

      for (size_t i = 0; i < (sizeof(buffer) - 1); i++)
      {
        if (buf_copy[i] == buf_copy[i + 1])
        {
          // char array is already sorted, if the next/right sibling of `i` is of EQUAL value (ascii rep)
          // then it means we have a duplicate, ergo => non unique value in buffer.
          all_descending = 0;
          break;
        }
      }

      if (all_descending == 1)
      {
        printf("marker hit! distance_from_start = %i\n", distance_from_start);
      }
    }
  }

  fclose(file);
  return 0;
}