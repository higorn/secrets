package io.esecrets.capacitor.autofill.data.dao;

import com.getcapacitor.JSObject;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

public class CacheDaoTest {

  private CacheDao dao;

  @Before
  public void setUp() {
    MockKvDao kvDao = new MockKvDao();
    dao = new CacheDao(kvDao);
    dao.add("com.example.android.autofill.app", "Autofill");
    dao.add("com.example.android.autofill.app", "AutofillApp");
    dao.add("com.example.android.autofill.app", "autofill");
    dao.add("io.myapp", "Myapp");
    dao.add("com.android.someapp", "someapp");
    dao.add("com.android.someapp", "SomeApp");
  }

  @After
  public void tearDown() {
    dao.clear();
  }

  @Test
  public void shouldGetTheCache() {
    JSObject cache = dao.get();

    assertNotNull(cache);
    assertEquals(3, cache.length());
  }

  @Test
  public void shouldUpdateTheCache() {
    JSObject cache = dao.get();

    dao.add("com.newapp", "newapp");
    dao.add("com.newapp", "NewApp");

    assertEquals(4, cache.length());
    Set<String> items = dao.get("com.newapp");
    assertFalse(items.isEmpty());
    assertEquals(2, items.size());
  }

  @Test
  public void shouldNotAddDuplicatedItems() {
    dao.add("com.newapp", "newapp");
    dao.add("com.newapp", "newapp");
    Set<String> items = dao.get("com.newapp");

    assertFalse(items.isEmpty());
    assertEquals(1, items.size());
  }
}
